// the module 'vscode' contains the VS Code extensibility API
// import the module and reference it with the alias vscode in your code below
import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode'; 

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "pomodoro-code" is now active!');

	let pomodoro = new Pomodoro();

	// Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(pomodoro);
}

class Pomodoro {
	private _statusBarItem: StatusBarItem;
	private _timer;

	constructor() {
		// create a new status bar item
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }
		
		this._timer = setInterval(() => this.update(), 1000);
	}

	public start() {

	}

	public stop() {

	}

	public reset() {

	}

	private update() {
		// update the status bar
		this._statusBarItem.text = '00:00';
		this._statusBarItem.show();
	}

	dispose() {
        this._statusBarItem.dispose();
    }
}