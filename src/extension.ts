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

	// list of commands
	var startDisposable = commands.registerCommand('extension.startPomodoro', () => {
        pomodoro.start();
    });

	var stopDisposable = commands.registerCommand('extension.stopPomodoro', () => {
        pomodoro.stop();
    });
	
	var resetDisposable = commands.registerCommand('extension.resetPomodoro', () => {
        pomodoro.reset();
    });
	
	// Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(pomodoro);
	context.subscriptions.push(startDisposable);
	context.subscriptions.push(stopDisposable);
	context.subscriptions.push(resetDisposable);
}

class Pomodoro {
	private _statusBarItem: StatusBarItem;
	private _timer: number;
	private _currentTime: number;

	constructor() {
		// create a new status bar item
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }

		this._currentTime = 0;
		this.update();
	}

	public start() {
		this._currentTime = 25 * 60;
		this._timer = setInterval(() => {
			// 1 second left
			this._currentTime--;
			this.update();
			
			// stop the timer if no second left
			if (this._currentTime <= 0) {
				this.stop();
			}
		}, 1000);
	}

	public stop() {
		clearInterval(this._timer);
	}

	public reset() {
		this.stop();
		this._currentTime = 25 * 60;
		this.update();
	}

	private update() {
		let seconds = this._currentTime % 60;
		let minutes = (this._currentTime - seconds) / 60;
		
		// update the status bar
		this._statusBarItem.text = ((minutes < 10) ? '0' : '') + minutes + ':' + ((seconds < 10) ? '0' : '') + seconds;
		this._statusBarItem.show();
	}

	dispose() {
		this.stop();
        this._statusBarItem.dispose();
    }
}