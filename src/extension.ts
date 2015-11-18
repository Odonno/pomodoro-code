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
	private _statusBarText: StatusBarItem;
	private _statusBarStartButton: StatusBarItem;
	private _statusBarStopButton: StatusBarItem;
	private _timer: number;
	private _currentTime: number;
	private _status: PomodoroStatus;

	constructor() {
		// create status bar items
        if (!this._statusBarText) {
            this._statusBarText = window.createStatusBarItem(StatusBarAlignment.Left);
        }
		if (!this._statusBarStartButton) {
            this._statusBarStartButton = window.createStatusBarItem(StatusBarAlignment.Left);
			this._statusBarStartButton.text = '$(triangle-right)';
			this._statusBarStartButton.command = 'extension.startPomodoro';
        }
		if (!this._statusBarStopButton) {
            this._statusBarStopButton = window.createStatusBarItem(StatusBarAlignment.Left);
			this._statusBarStopButton.text = '$(primitive-square)';
			this._statusBarStopButton.command = 'extension.stopPomodoro';
        }

		this._status = PomodoroStatus.None;
		this._currentTime = 0;
		this.update();
	}

	public start(status: PomodoroStatus = PomodoroStatus.Work) {
		if (status == PomodoroStatus.Work) {
			this._currentTime = 25 * 60;
			this._status = status;
		} else if (status == PomodoroStatus.Pause) {
			this._currentTime = 5 * 60;
			this._status = status;
		} else {
			console.error("This status is not available, can't start the timer");
		}

		this._timer = setInterval(() => {
			// 1 second left
			this._currentTime--;
			this.update();
			
			// stop the timer if no second left
			if (this._currentTime <= 0) {
				this.next();
			}
		}, 1000);
	}

	public stop() {
		clearInterval(this._timer);
		this._status = PomodoroStatus.None;
		this.update();
	}

	public reset() {
		this.stop();
		this._currentTime = 25 * 60;
		this.update();
	}

	private next() {
		if (this._status == PomodoroStatus.Work) {
			this.start(PomodoroStatus.Pause);
		} else if (this._status == PomodoroStatus.Pause) {
			this.stop();
		}
	}

	private update() {
		let seconds = this._currentTime % 60;
		let minutes = (this._currentTime - seconds) / 60;
		
		// update status bar (commands)
		if (this._status == PomodoroStatus.None) {
			this._statusBarStartButton.show();
			this._statusBarStopButton.hide();
		} else {
			this._statusBarStartButton.hide();
			this._statusBarStopButton.show();
		}
		
		// update status bar (text)
		this._statusBarText.text = ((minutes < 10) ? '0' : '') + minutes + ':' + ((seconds < 10) ? '0' : '') + seconds;

		if (this._status == PomodoroStatus.Work) {
			this._statusBarText.text += ' (work)';
		}
		if (this._status == PomodoroStatus.Pause) {
			this._statusBarText.text += ' (pause)';
		}

		this._statusBarText.show();
	}

	dispose() {
		this.stop();
        this._statusBarText.dispose();
		this._statusBarStartButton.dispose();
		this._statusBarStopButton.dispose();
    }
}

enum PomodoroStatus {
	None,
	Work,
	Pause
}