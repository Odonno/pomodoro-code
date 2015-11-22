// 
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import {Timer, Pomodoro, PomodoroStatus} from '../src/extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", () => {

	suite("Timer Tests", () => {
		test("A new timer should have default values", (done) => {
			// arrange
			let timer = new Timer();
			
			// act
			
			// assert			
			assert.equal(0, timer.currentTime);
			assert.equal(1000, timer.interval);
			done();
		});

		test("Start a timer should set current time", (done) => {
			// arrange
			let timer = new Timer();
			
			// act
			timer.start(1, () => { });
			
			// assert			
			assert.equal(1, timer.currentTime);
			done();
		});

		test("Start a timer twice should not override the first timer", (done) => {
			// arrange
			let timer = new Timer();
			
			// act
			timer.start(1, () => { });
			timer.start(5, () => { });
			
			// assert			
			assert.equal(1, timer.currentTime);
			done();
		});

		test("A timer should tick at least once", (done) => {
			// arrange
			let timer = new Timer();
			
			// act
			timer.start(5, () => { });
			
			// assert
			setTimeout(() => {
				assert.equal(4, timer.currentTime);
				done();
			}, 1000); // after 1 second	
		});

		test("A timer should execute callback each tick", (done) => {
			// arrange
			let timer = new Timer();
			let ticks = 0;
			
			// act
			timer.start(5, () => {
				ticks++;
			});
			
			// assert
			setTimeout(() => {
				assert.equal(1, ticks);
				done();
			}, 1000); // after 1 second	
		});

		test("A stopped timer should not tick", (done) => {
			// arrange
			let timer = new Timer();
			
			// act
			timer.start(5, () => { });
			timer.stop();
			
			// assert
			setTimeout(() => {
				assert.equal(5, timer.currentTime);
				done();
			}, 1000); // after 1 second	
		});
	});

	suite("Pomodoro Tests", () => {
		test("A new Pomodoro should have default values", (done) => {
			// arrange
			let pomodoro = new Pomodoro();
			
			// act
			
			// assert			
			assert.equal(PomodoroStatus.None, pomodoro.status);
			assert.equal(25 * 60, pomodoro.workTime);
			assert.equal(5 * 60, pomodoro.pauseTime);
			done();
		});
		
		test("A new Pomodoro with time values should override them", (done) => {
			// arrange
			let pomodoro = new Pomodoro(33 * 60, 12 * 60);
			
			// act
			
			// assert
			assert.equal(33 * 60, pomodoro.workTime);
			assert.equal(12 * 60, pomodoro.pauseTime);
			done();
		});
		
		test("Starting a Pomodoro should update status", (done) => {
			// arrange
			let pomodoro = new Pomodoro();
			
			// act
			pomodoro.start();
			
			// assert
			assert.equal(PomodoroStatus.Work, pomodoro.status);
			done();
		});
		
		test("Waiting until work timer is over should switch to pause", (done) => {
			// arrange
			let pomodoro = new Pomodoro(1, 5);
			pomodoro.start();
			assert.equal(PomodoroStatus.Work, pomodoro.status);
			
			// act
			// assert
			setTimeout(() => {
				assert.equal(PomodoroStatus.Pause, pomodoro.status);
				done();
			}, 1000); // after 1 second
		});
	});

});