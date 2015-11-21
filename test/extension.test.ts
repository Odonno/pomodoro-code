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
		test("A new timer should have default values", () => {
			// arrange
			var timer = new pomodoroExtension.Timer();
			
			// act
			
			// assert			
			assert.equal(0, timer.currentTime);
		});

		test("Start a timer should set current time", () => {
			// arrange
			var timer = new pomodoroExtension.Timer();
			
			// act
			timer.start(1, 1000, () => { });
			
			// assert			
			assert.equal(1, timer.currentTime);
		});
	});

	suite("Pomodoro Tests", () => {

	});

});