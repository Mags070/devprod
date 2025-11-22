const vscode = require('vscode');
const fs=require('fs');
const path=require('path');

function gettime(){
	return new Date().toISOString().replace(/[:.]/g,"-");
}
async function savefile(aicontent, originalFileUri, extension = "md") {
    const workfolder=vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;//stackover
    if(!workfolder){
        vscode.window.showErrorMessage("open folder to save docs");
        return;
    }
    const base=path.basename(originalFileUri.fsPath,path.extname(originalFileUri.fsPath));
    const filename=`${base}_doc_${gettime()}.${extension}`;
    const filepath=path.join(workfolder,filename);
    fs.writeFileSync(filepath,aicontent,"utf-8");
    const doc=await vscode.workspace.openTextDocument(filepath);
    vscode.window.showTextDocument(doc);


}

module.exports={savefile};