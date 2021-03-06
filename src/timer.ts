class Timer {
	private _timerId: number;
	public get isRunning() {
		return this._timerId != 0;
	}

	constructor(public currentTime: number = 0, public interval: number = 1000) {
		this._timerId = 0;
	}
	
	public reset(time: number) {
		this.stop();
		this.currentTime = time;
	}

	public start(callback) {
		if (this._timerId == 0) {
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

export = Timer