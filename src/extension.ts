// the module 'vscode' contains the VS Code extensibility API
// import the module and reference it with the alias vscode in your code below
import {workspace, window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';

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

export class Pomodoro {
	private _statusBarText: StatusBarItem;
	private _statusBarStartButton: StatusBarItem;
	private _statusBarStopButton: StatusBarItem;

	private _status: PomodoroStatus;
	public get status() {
		return this._status;
	}
	public set status(status: PomodoroStatus) {
		this._status = status;
		this.toggleButtons();
	}

	private _timer: Timer;
	public get timer() {
		return this._timer;
	}

	constructor(public workTime: number = 25 * 60, public pauseTime: number = 5 * 60) {
		// create status bar items
        if (!this._statusBarText) {
            this._statusBarText = window.createStatusBarItem(StatusBarAlignment.Left);
			this._statusBarText.show();
        }
		if (!this._statusBarStartButton) {
            this._statusBarStartButton = window.createStatusBarItem(StatusBarAlignment.Left);
			this._statusBarStartButton.text = '$(triangle-right)';
			this._statusBarStartButton.command = 'extension.startPomodoro';
			this._statusBarStartButton.tooltip = 'Start Pomodoro';
        }
		if (!this._statusBarStopButton) {
            this._statusBarStopButton = window.createStatusBarItem(StatusBarAlignment.Left);
			this._statusBarStopButton.text = '$(primitive-square)';
			this._statusBarStopButton.command = 'extension.stopPomodoro';
			this._statusBarStopButton.tooltip = 'Stop Pomodoro';
        }

		this.status = PomodoroStatus.None;
		this._timer = new Timer();
		this.draw();
	}

	public start(status: PomodoroStatus = PomodoroStatus.Work) {
		if (status == PomodoroStatus.Work) {
			this.status = status;
			this.toggleButtons();
			this._timer.start(this.workTime, () => {
				this.update();
				this.draw();
			});
		} else if (status == PomodoroStatus.Pause) {
			this.status = status;
			this.toggleButtons();
			this._timer.start(this.pauseTime, () => {
				this.update();
				this.draw();
			});
		} else {
			console.error("This status is not available, can't start the timer");
		}

		this.draw();
	}

	public stop() {
		this._timer.stop();
		this.status = PomodoroStatus.None;
		this.draw();
	}

	public reset() {
		this.stop();
		this._timer.currentTime = this.workTime;
		this.draw();
	}

	private update() {
		// stop the timer if no second left
		if (this._timer.currentTime <= 0) {
			if (this.status == PomodoroStatus.Work) {
				window.showInformationMessage('Work done ! Take a break. :)');
				this.stop();
				this.start(PomodoroStatus.Pause);
			} else if (this.status == PomodoroStatus.Pause) {
				window.showInformationMessage('Pause is over ! :(');
				this.stop();
			}
		}
	}

	private draw() {
		let seconds = this._timer.currentTime % 60;
		let minutes = (this._timer.currentTime - seconds) / 60;

		// update status bar (text)
		let timerPart = ((minutes < 10) ? '0' : '') + minutes + ':' + ((seconds < 10) ? '0' : '') + seconds
		let statusPart = '';
		if (this.status == PomodoroStatus.Work) {
			statusPart += ' (work)';
		} else if (this.status == PomodoroStatus.Pause) {
			statusPart += ' (pause)';
		}

		this._statusBarText.text = timerPart + statusPart;
	}

	private toggleButtons() {
		// update status bar (visibility)
		if (this.status == PomodoroStatus.None) {
			this._statusBarStartButton.show();
			this._statusBarStopButton.hide();
		} else {
			this._statusBarStartButton.hide();
			this._statusBarStopButton.show();
		}

		this._statusBarText.show();
	}

	public dispose() {
		this.stop();
        this._statusBarText.dispose();
		this._statusBarStartButton.dispose();
		this._statusBarStopButton.dispose();
    }
}

export class Timer {
	private _timerId: number;
	public get isRunning() {
		return this._timerId != 0;
	}

	constructor(public currentTime: number = 0, public interval: number = 1000) {
		this._timerId = 0;
	}

	public start(time: number, callback) {
		if (this._timerId == 0) {
			this.currentTime = time;

			this._timerId = setInterval(() => {
				this.tick();
				callback();
			}, this.interval);
		} else {
			console.error('A timer instance is already running...');
		}
	}

	public stop() {
		if (this._timerId != 0) {
			clearInterval(this._timerId);
		}

		this._timerId = 0;
	}

	private tick() {
		this.currentTime -= this.interval / 1000;
	}
}

export enum PomodoroStatus {
	None,
	Work,
	Pause
}