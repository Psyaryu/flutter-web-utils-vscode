import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as cp from 'child_process';

export function activate(context: vscode.ExtensionContext) {

	const commandServeFlutterWeb = vscode.commands.registerCommand('flutter-web-utils-vscode.serveFlutterWeb', () => {
		vscode.commands.executeCommand('workbench.action.tasks.runTask', 'Serve Flutter Web');
	});

	const commandDeployFlutterWeb = vscode.commands.registerCommand('flutter-web-utils-vscode.deployFlutterWeb', () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder found. Please open a workspace folder.');
			return;
		}

		const sourcePath = path.join(workspaceFolders[0].uri.fsPath, 'build', 'web');
		const destinationPath = path.join(workspaceFolders[0].uri.fsPath, '..', 'Psyaryu.github.io');

		try {
			vscode.window.showInformationMessage('Flutter Web App Started Deploying');
			
			const env = { ...process.env };
			env.PATH = env.PATH + ':/Users/psyaryu/fvm/default/bin';
			cp.execSync('flutter build web --wasm', { cwd: workspaceFolders[0].uri.fsPath, env: env });

			const files = fs.readdirSync(destinationPath);
			for (const file of files) {
			  if (file === '.git')
			  {
				continue;
			  }
		  
			  const fullPath = path.join(destinationPath, file);
			  fs.removeSync(fullPath);
			}

			fs.copySync(sourcePath, destinationPath, { overwrite: true });

			const configuration = vscode.workspace.getConfiguration('flutterWebUtils');
			const username = configuration.get('username');
			const token = configuration.get('deployToken');
			const remoteUrl = `https://${username}:${token}@github.com/${username}/Psyaryu.github.io`;
			
			cp.execSync(`git remote set-url origin ${remoteUrl}`, {
				cwd: destinationPath
			});
			
			cp.execSync('git add .', { cwd: destinationPath});
			cp.execSync('git commit -m "Deploy Flutter App"', {	cwd: destinationPath });
			cp.execSync('git push origin main', { cwd: destinationPath });

			vscode.window.showInformationMessage('Flutter Web App Finished Deploying');
		}
		catch (err: any) {
			vscode.window.showErrorMessage('Error: ' + err.message);
		}
	});

	context.subscriptions.push(commandServeFlutterWeb);
	context.subscriptions.push(commandDeployFlutterWeb);
}

export function deactivate() {}
