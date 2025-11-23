const vscode = require("vscode");
const { getexplain } = require("./geminiAI");

async function hoverinfo(document, position) {
    try {
        const line=document.lineAt(position.line).text.trim();
        if (!line){
            return new vscode.Hover(
                new vscode.MarkdownString("No code detected")
            );
        }
        if (/^\/\//.test(line) || /^#/.test(line)) {
            return new vscode.Hover(
                new vscode.MarkdownString("no analysis needed")
            );
        }
        const explanation= await getexplain(line);
        return new vscode.Hover(
            new vscode.MarkdownString(explanation)
        );

    } catch (err) {
        console.error("Hover error:", err);
        return new vscode.Hover(
            new vscode.MarkdownString("*(Unable to generate explanation)*")
        );
    }
}

module.exports = { hoverinfo };
