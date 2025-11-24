const vscode=require("vscode");
const path=require("path");
const {explainCode}= require("./geminiAI");

function detectlanguage(file){
    const ext=file.split('.').pop()?.toLowerCase()||"";
    const importpattern={
        js:[/import\s+.*?\s+from\s+['"](.*?)['"]/g,
        /require\(['"](.*?)['"]\)/g,],

        ts:[/import\s+.*?\s+from\s+['"](.*?)['"]/g,],
        
        py:[ /import\s+([a-zA-Z0-9_]+)/g,
        /from\s+([a-zA-Z0-9_.]+)\s+import/g,],

        java:[/import\s+([a-zA-Z0-9_.]+);/g,],

        cs:[ /using\s+([a-zA-Z0-9_.]+);/g,],

        cpp:[/#include\s+[<"](.+?)[>"]/g,],

        php:[/use\s+([a-zA-Z0-9_\\]+);/g,
        /include\s*['"](.*?)['"]/g,
        /require\s*['"](.*?)['"]/g,],

        rb:[/require\s+['"](.*?)['"]/g,],

        go:[
        /import\s+["](.*?)["]/g,
        /import\s+\(([\s\S]*?)\)/g,],
        
        rs:[ /use\s+([a-zA-Z0-9_:]+);/g,],

        kt:[/import\s+([a-zA-Z0-9_.]+)/g,],

        swift:[/import\s+([A-Za-z0-9_]+)/g,],
    };

    return importpattern[ext] || [];
}

function extractimports(code,filename){
        const patterns=detectlanguage(filename);
        let imports=[]
        for (const regex of patterns) {
        let match;
        while ((match=regex.exec(code))!==null) {
            imports.push(match[1]);
        }
    }
    return imports;
}

async function findfile(modulepath) {
    const attempts = [
        `**/${modulepath}.*`,
        `**/${modulepath.replace(/\./g, "/")}.*`,
    ];

    for (let pattern of attempts) {
        const found = await vscode.workspace.findFiles(pattern, "**/node_modules/**", 1);
        if (found.length > 0) return found[0];
    }
    return null;
}

async function readfile(uri) {
    try {
        const data = await vscode.workspace.fs.readFile(uri);
        return Buffer.from(data).toString("utf8");
    } catch {
        return "";
    }
}

async function codespace(){
    const editor=vscode.window.activeTextEditor;
    if(!editor){
        vscode.window.showErrorMessage("no active window");
        return;
    }
    const maindoc= editor.document;
    const maincode= maindoc.getText();
    const mainfilename= path.basename(maindoc.fileName);

    const imports= extractimports(maincode, mainfilename);

    let importedcontent=[];

    for (const imp of imports.slice(0, 3)) {
        const uri = await findfile(imp);
        if (!uri) continue;
        const content = await readfile(uri);
        importedcontent.push(`// FILE: ${uri.fsPath}// ----------------------
        ${content}`);
    }

    const ragContext = `
// MAIN FILE: ${maindoc.fileName}
// ---------------------------------
${maincode}
${importedcontent.join("\n\n")}`;

    const question= await vscode.window.showInputBox({
        title: "Ask AI about this code",
        placeHolder: "e.g. Explain what this file does"
    });
    if (!question) return;

    const result= await explainCode(ragContext,question);

    const panel= vscode.window.createWebviewPanel(
        "codeExplanation",
        "AI Codebase Explanation",
        vscode.ViewColumn.Beside,
        { enableScripts: true }
    );

     panel.webview.html = `
        <html>
        <body style="font-family: sans-serif; padding: 20px; white-space: pre-wrap;">
            <h2>AI Code Explanation</h2>
            <div>${result.replace(/\n/g, "<br>")}</div>
        </body>
        </html>
    `;
}

module.exports = { codespace };
