// the module 'vscode' contains the VS Code extensibility API
// import the module and reference it with the alias vscode in your code below
import {workspace, window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';
import Pomodoro = require('./pomodoro');

var fs = require('fs');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "pomodoro-code" is now active!');

	// create variables
	let userHome = process.env[(process.platform == 'win32' ? 'USERPROFILE' : 'HOME')];
	let configRelativeUri = '/.vscode/extensions/odonno.pomodoro-code/out/config.json';
	let configFileUri = userHome + configRelativeUri;

	// read config file
	let config = fs.readFileSync(configFileUri, 'utf8');
	config = JSON.parse(config);

	// create a new Pomodoro
	let pomodoro = new Pomodoro(config.work * 60, config.pause * 60);

	// list of commands
	let startDisposable = commands.registerCommand('extension.startPomodoro', () => {
        pomodoro.start();
    });

	let stopDisposable = commands.registerCommand('extension.stopPomodoro', () => {
        pomodoro.stop();
    });

	let resetDisposable = commands.registerCommand('extension.resetPomodoro', () => {
        pomodoro.reset();
    });

	let configureDisposable = commands.registerCommand('extension.configurePomodoro', () => {
		workspace.openTextDocument(configFileUri)
			.then((document) => {
				window.showTextDocument(document);
				window.showInformationMessage("Once you have made the change, please restart.");
			});
    });
	
	// Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(pomodoro);
	context.subscriptions.push(startDisposable);
	context.subscriptions.push(stopDisposable);
	context.subscriptions.push(resetDisposable);
	context.subscriptions.push(configureDisposable);
}