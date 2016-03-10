import {window} from 'vscode';

import PomodoroStatus = require('./pomodoroStatus');
import Timer = require('./timer');

class Pomodoro {
    private _status: PomodoroStatus;
    public get status() {
        return this._status;
    }
    public set status(status: PomodoroStatus) {
        this._status = status;
    }

    private _timer: Timer;
    public get timer() {
        return this._timer;
    }

    constructor(public workTime: number = 25 * 60, public pauseTime: number = 5 * 60) {
        this._timer = new Timer();
        this.status = PomodoroStatus.None;
    }

    // private methods
    private done() {
        this.stop();
        this.status = PomodoroStatus.Done;
    }

    private resetTimer(status: PomodoroStatus) {
        if (status == PomodoroStatus.Work) {
            this.timer.reset(this.workTime);
        }
        if (status == PomodoroStatus.Pause) {
            this.timer.reset(this.pauseTime);
        }
    }

    // public methods
    public start(status: PomodoroStatus = PomodoroStatus.Work) {
        if (status == PomodoroStatus.Work || status == PomodoroStatus.Pause) {
            if (this.status != PomodoroStatus.Wait)
                this.resetTimer(status);

            this.status = status;

            this._timer.start(() => {
                // stop the timer if no second left
                if (this.timer.currentTime <= 0) {
                    if (this.status == PomodoroStatus.Work) {
                        window.showInformationMessage('Work done ! Take a break. :)');
                        this.start(PomodoroStatus.Pause);
                    } else if (this.status == PomodoroStatus.Pause) {
                        window.showInformationMessage('Pause is over ! :(');
                        this.done();
                    }
                }
            });
        } else {
            console.error("This status is not available, can't start the timer");
        }
    }

    public pause() {
        this.stop();
        this.status = PomodoroStatus.Wait;
    }

    public reset() {
        this.stop();
        this.status = PomodoroStatus.None;
        this._timer.currentTime = this.workTime;
    }

    public stop() {
        this._timer.stop();
    }

    public dispose() {
        this.stop();
        this.status = PomodoroStatus.None;
    }
}

export = Pomodoro;