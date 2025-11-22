const vscode=require("vscode");
const {savefile}=require('./saveFile');
const{GenerateDoc}=require('./geminiAI');
async function documentation(){
			const editor=vscode.window.activeTextEditor;
			if(!editor){
				vscode.window.showErrorMessage("Opening of file failed");
				return;
			}
			const code=editor.document.getText();
			const fileurl=editor.document.uri;
			vscode.window.showInformationMessage("Generating Documentation.");
			const result=await GenerateDoc(code);
			vscode.window.showInformationMessage("Documentation done");
			const panel=vscode.window.createWebviewPanel(
				"Documentation",
				"Generated Documentation",
				vscode.ViewColumn.Beside,
                {enableScripts:true}
			);
			panel.webview.html=`<html>
			<body style="font-family:sans-serif;">
			<button id="savebtn">Save File</button>
            <button id="regenbtn">Regenerate</button>
            <hr/>
			<pre id="content">${result}</pre>
			<script>
			const vscode=acquireVsCodeApi();
			document.getElementById("savebtn").addEventListener("click", () => {
                    vscode.postMessage({ command: "save" });
                });

                document.getElementById("regenbtn").addEventListener("click", () => {
                    vscode.postMessage({ command: "regenerate" });
                });
            </script>
			</body>
			</html>`;
			panel.webview.onDidReceiveMessage(async (msg)=>{
					if(msg.command=='save'){
						await savefile(result,fileurl,"md");
            			vscode.window.showInformationMessage("Documentation saved.");
					}
					if(msg.command=='regenerate'){
						vscode.window.showInformationMessage("Regenerating Docs");
						const newdoc=await GenerateDoc(code);
						panel.webview.html = `
                <html>
                <body style="font-family: sans-serif;">
                    <button id="saveBtn">Save File</button>
                    <button id="regenBtn">Regenerate</button>
                    <hr/>
                    <pre id="content">${newdoc}</pre>

                    <script>
                        const vscode = acquireVsCodeApi();
                        document.getElementById("saveBtn").addEventListener("click", () => {
                            vscode.postMessage({ command: "save" });
                        });
                        document.getElementById("regenBtn").addEventListener("click", () => {
                            vscode.postMessage({ command: "regenerate" });
                        });
                    </script>
                </body>
                </html>`;
			}
		})
}
module.exports={documentation};
