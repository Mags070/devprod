const vscode = require('vscode');
const {documentation}=require('./documentation_vs.js');
const {addcoms}=require('./comments_vs');
const {fixoptimize}=require('./optimization_vs');
const {debugfix}=require('./debugger_vs');
const {hoverinfo}=require('./hover_info_vs.js');
const{codespace}=require('./explain_codespace_vs.js');
/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	let disposable=vscode.commands.registerCommand('devprod.gendoc',async function(){await documentation();});
	context.subscriptions.push(disposable);
	let comments=vscode.commands.registerCommand('devprod.addcomments',async function(){await addcoms();});
	context.subscriptions.push(comments);
	let fixcode=vscode.commands.registerCommand("devprod.fix",async function(){await fixoptimize();});
	context.subscriptions.push(fixcode);
	let debug=vscode.commands.registerCommand("devprod.explainerror",async function(){await debugfix();});
	context.subscriptions.push(debug);
	let hover=vscode.languages.registerHoverProvider({scheme:'file',language:'*'},
		 {async provideHover(document, position) {
            return hoverinfo(document, position);
        }
	}
	);
    context.subscriptions.push(hover);
	let explaincode=vscode.commands.registerCommand("devprod.explaincode",async function(){
		await codespace();
	})

	context.subscriptions.push(explaincode);

}



function deactivate() {}

module.exports = {
	activate,
	deactivate
}
