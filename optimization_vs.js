const vscode=require("vscode");
const {fixAndOptimize}=require("./geminiAI");

 async function fixoptimize() {
        const editor= vscode.window.activeTextEditor;
        if (!editor) return vscode.window.showErrorMessage("No active file");
        const code= editor.document.getText();
        vscode.window.showInformationMessage("Fixing and optimizing code");
        const fixed= await fixAndOptimize(code);
        vscode.window.showInformationMessage("Code optimized!");
        const panel= vscode.window.createWebviewPanel(
            "FixCode",
            "AI Code Fixes",
            vscode.ViewColumn.Beside,
            {}
        );
        panel.webview.html = `<pre>${fixed}</pre>`;
    }
module.exports={fixoptimize};