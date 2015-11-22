// the module 'vscode' contains the VS Code extensibility API
// import the module and reference it with the alias vscode in your code below
import {workspace, window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';

import PomodoroStatus = require('./pomodoroStatus');
import Timer = require('./timer');

class Pomodoro {
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

export = Pomodoro