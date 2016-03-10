import {window, StatusBarAlignment, StatusBarItem} from 'vscode';

import Pomodoro = require('./pomodoro');
import PomodoroStatus = require('./pomodoroStatus');
import IPomodoroConfig = require('./pomodoroConfig');
import Timer = require('./timer');

class PomodoroManager {
    // logic properties
    private _currentPomodoro: Pomodoro;
    private _pomodori: Pomodoro[];

    // UI properties
    private _statusBarText: StatusBarItem;
    private _statusBarStartButton: StatusBarItem;
    private _statusBarPauseButton: StatusBarItem;

    constructor(public configuration?: IPomodoroConfig[]) {
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
        if (!this._statusBarPauseButton) {
            this._statusBarPauseButton = window.createStatusBarItem(StatusBarAlignment.Left);
            this._statusBarPauseButton.text = '$(primitive-square)';
            this._statusBarPauseButton.command = 'extension.pausePomodoro';
            this._statusBarPauseButton.tooltip = 'Pause Pomodoro';
        }

        this._pomodori = [];

        if (!configuration || typeof (configuration) !== 'array' || configuration.length < 1) {
            this._pomodori.push(new Pomodoro());
        } else {
            const minutesPerHour = 60;
            for (let i = 0; i < configuration.length; i++) {
                let pomodoro = new Pomodoro(configuration[i].work * minutesPerHour, configuration[i].pause * minutesPerHour);
                this._pomodori.push(pomodoro);
            }
        }

        this._currentPomodoro = this._pomodori[0];
        this.draw();
    }

    private update() {
        // TODO : handle launch of the next Pomodoro

    }

    private draw() {
        let seconds = this._currentPomodoro.timer.currentTime % 60;
        let minutes = (this._currentPomodoro.timer.currentTime - seconds) / 60;

        // update status bar (text)
        let timerPart = ((minutes < 10) ? '0' : '') + minutes + ':' + ((seconds < 10) ? '0' : '') + seconds
        let statusPart = '';
        if (this._currentPomodoro.status == PomodoroStatus.Work) {
            statusPart += ' (work)';
        } else if (this._currentPomodoro.status == PomodoroStatus.Pause) {
            statusPart += ' (pause)';
        }

        this._statusBarText.text = timerPart + statusPart;
    }

    private toggleButtons() {
        // update status bar (visibility)
        if (this._currentPomodoro.status == PomodoroStatus.None ||
            this._currentPomodoro.status == PomodoroStatus.Wait) {
            this._statusBarStartButton.show();
            this._statusBarPauseButton.hide();
        } else {
            this._statusBarStartButton.hide();
            this._statusBarPauseButton.show();
        }

        this._statusBarText.show();
    }

    public start() {
        // TODO
    }

    public pause() {
        // TODO
    }

    public reset() {
        // TODO
    }

    public dispose() {
        // stop current Pomodoro
        this._currentPomodoro.dispose();

        // reset Pomodori

        this._statusBarText.dispose();
        this._statusBarStartButton.dispose();
        this._statusBarPauseButton.dispose();
    }
}

export = PomodoroManager