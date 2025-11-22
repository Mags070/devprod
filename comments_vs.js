const vscode=require("vscode");
const {addcomments}=require("./geminiAI");
async function addcoms() {
				const editor=vscode.window.activeTextEditor;
				if(!editor){
					vscode.window.showErrorMessage("No active file");
				}
				const code=editor.document.getText();
				const range=new vscode.Range(editor.document.positionAt(0),editor.document.positionAt(code.length));
				const fileurl=editor.document.uri;
				vscode.window.showInformationMessage("Adding comments");
				console.log(fileurl);
				const res=await addcomments(code);
				await editor.edit(editbuilder=>{editbuilder.replace(range,res)});
				vscode.window.showInformationMessage("Comments added");
				const panel=vscode.window.createWebviewPanel(
					"Comments",
					"Added Comments",
					vscode.ViewColumn.Beside,
					{}
				);
				panel.webview.html=`<pre>${res}<\pre>`;
		}
module.exports={addcoms};