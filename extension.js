const vscode = require('vscode');
const {documentation}=require('./documentation_vs.js');
const {addcoms}=require('./comments_vs');
const {fixoptimize}=require('./optimization_vs');
const {debugfix}=require('./debugger_vs');
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
   
}



function deactivate() {}

module.exports = {
	activate,
	deactivate
}
