// the module 'vscode' contains the VS Code extensibility API
// import the module and reference it with the alias vscode in your code below
import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode'; 

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "pomodoro-code" is now active!');

	// initialize a new Pomodoro manager
	let pomodoro = new Pomodoro();

	var disposable = commands.registerCommand('extension.startPomodoro', () => {
        pomodoro.start();
    });

	// Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(pomodoro);
}

class Pomodoro {
	private _statusBarItem: StatusBarItem;
	private _timer;
	private _currentTimer: number;

	constructor() {
		// create a new status bar item
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }

		this._currentTimer = 0;
		this.update();
	}

	public start() {
		this._currentTimer = 25 * 60;
		this._timer = setInterval(() => {
			// 1 second left
			this._currentTimer--;
			this.update();
		}, 1000);
	}

	public stop() {

	}

	public reset() {

	}

	private update() {
		// update the status bar
		this._statusBarItem.text = (this._currentTimer / 60) + ':' + (this._currentTimer % 60);
		this._statusBarItem.show();
	}

	dispose() {
        this._statusBarItem.dispose();
    }
}