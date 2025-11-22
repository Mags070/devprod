const vscode=require("vscode");
const {debuggers }=require('./geminiAI');

async function debugfix() {
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

module.exports={debugfix};