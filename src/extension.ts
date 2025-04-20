import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	const commandServeFlutterWeb = vscode.commands.registerCommand('flutter-web-utils-vscode.serveFlutterWeb', () => {
		vscode.commands.executeCommand('workbench.action.tasks.runTask', 'Serve Flutter Web');
	});

	context.subscriptions.push(commandServeFlutterWeb);
}

// This method is called when your extension is deactivated
export function deactivate() {}
