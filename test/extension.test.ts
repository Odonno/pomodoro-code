// 
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as pomodoroExtension from '../src/extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", () => {

	suite("Timer Tests", () => {
		test("A new timer should have default values", (done) => {
			// arrange
			let timer = new pomodoroExtension.Timer();
			
			// act
			
			// assert			
			assert.equal(0, timer.currentTime);
			done();
		});

		test("Start a timer should set current time", (done) => {
			// arrange
			let timer = new pomodoroExtension.Timer();
			
			// act
			timer.start(1, 1000, () => { });
			
			// assert			
			assert.equal(1, timer.currentTime);
			done();
		});

		test("Start a timer twice should not override the first timer", (done) => {
			// arrange
			let timer = new pomodoroExtension.Timer();
			
			// act
			timer.start(1, 1000, () => { });
			timer.start(5, 1000, () => { });
			
			// assert			
			assert.equal(1, timer.currentTime);
			done();
		});

		test("A timer should tick at least once", (done) => {
			// arrange
			let timer = new pomodoroExtension.Timer();
			
			// act
			timer.start(5, 1000, () => { });
			
			// assert
			setTimeout(() => {
				assert.equal(4, timer.currentTime);
				done();
			}, 1000); // after 1 second	
		});

		test("A timer should execute callback each tick", (done) => {
			// arrange
			let timer = new pomodoroExtension.Timer();
			let ticks = 0;
			
			// act
			timer.start(5, 1000, () => {
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
			let timer = new pomodoroExtension.Timer();
			
			// act
			timer.start(5, 1000, () => { });
			timer.stop();
			
			// assert
			setTimeout(() => {
				assert.equal(5, timer.currentTime);
				done();
			}, 1000); // after 1 second	
		});
	});

	suite("Pomodoro Tests", () => {

	});

});