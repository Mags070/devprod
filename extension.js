const vscode = require('vscode');
const {fixAndOptimize, debuggers }=require('./geminiAI');
const {documentation}=require('./documentation_vs.js');
const {addcoms}=require('./comments_vs');

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	let disposable=vscode.commands.registerCommand('devprod.gendoc',async function(){await documentation();});
	context.subscriptions.push(disposable);
	let comments=vscode.commands.registerCommand('devprod.addcomments',async function(){await addcoms();})
	context.subscriptions.push(comments);
	let fixcode=vscode.commands.registerCommand("devprod.fix",
    async function() {
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
	);
	context.subscriptions.push(fixcode);
	let debug=vscode.commands.registerCommand("devprod.explainerror",
		async function () {
				const editor=vscode.window.activeTextEditor;
				if(!editor) return vscode.window.showErrorMessage("No active window open");
				const code=editor.document.getText();
				const diagnostics=vscode.languages.getDiagnostics(editor.document.uri);
				if(diagnostics.length==0) return vscode.window.showErrorMessage("No errors to debug");
				vscode.window.showInformationMessage("Analyizing errors");
				const result= await debuggers(code,diagnostics);
				const panel = vscode.window.createWebviewPanel(
								"Debuggers",
								"AI Debugger Report",
								vscode.ViewColumn.Beside,
								{ enableScripts: true }
							);
				panel.webview.html=` <html>
									<body style="font-family: monospace; padding: 20px;">
										<h2>AI Debugger Report</h2>
										<pre>${result}</pre>
									</body>
									</html>`;
				

		}
	)
	context.subscriptions.push(debug);
   
}



function deactivate() {}

module.exports = {
	activate,
	deactivate
}
