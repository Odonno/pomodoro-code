// 
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import PomodoroStatus = require('../src/pomodoroStatus');
import Timer = require('../src/timer');
import Pomodoro = require('../src/pomodoro');
import IPomodoroConfig = require('../src/pomodoroConfig');
import PomodoroManager = require('../src/pomodoroManager');

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
            assert.equal(false, timer.isRunning);
            done();
        });

        test("Start a timer should set current time", (done) => {
            // arrange
            let timer = new Timer(1);

            // act
            timer.start(() => { });

            // assert			
            assert.equal(1, timer.currentTime);
            assert.equal(true, timer.isRunning);
            done();
        });

        test("Start a timer twice should not override the first timer", (done) => {
            // arrange
            let timer = new Timer(1);

            // act
            timer.start(() => { });
            timer.start(() => { });

            // assert			
            assert.equal(1, timer.currentTime);
            assert.equal(true, timer.isRunning);
            done();
        });

        test("A timer should tick at least once", (done) => {
            // arrange
            let timer = new Timer(5);

            // act
            timer.start(() => { });

            // assert
            setTimeout(() => {
                assert.equal(4, timer.currentTime);
                assert.equal(true, timer.isRunning);
                done();
            }, 1000); // after 1 second	
        });

        test("A timer should execute callback each tick", (done) => {
            // arrange
            let timer = new Timer(5);
            let ticks = 0;

            // act
            timer.start(() => {
                ticks++;
            });

            // assert
            setTimeout(() => {
                assert.equal(1, ticks);
                assert.equal(true, timer.isRunning);
                done();
            }, 1000); // after 1 second	
        });

        test("A stopped timer should not tick", (done) => {
            // arrange
            let timer = new Timer(5);

            // act
            timer.start(() => { });
            timer.stop();

            // assert
            setTimeout(() => {
                assert.equal(5, timer.currentTime);
                assert.equal(false, timer.isRunning);
                done();
            }, 1000); // after 1 second	
        });

        test("Reset a timer should stop", (done) => {
            // arrange
            let timer = new Timer(5);

            // act
            timer.start(() => { });

            // assert
            setTimeout(() => {
                timer.reset(5);
                assert.equal(false, timer.isRunning);
                done();
            }, 1000); // after 1 second	
        });

        test("Reset a timer should set current time", (done) => {
            // arrange
            let timer = new Timer(5);

            // act
            timer.start(() => { });

            // assert
            setTimeout(() => {
                timer.reset(5);
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
            assert.equal(0, pomodoro.timer.currentTime);
            assert.equal(false, pomodoro.timer.isRunning);
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
            assert.equal(25 * 60, pomodoro.timer.currentTime);
            assert.equal(true, pomodoro.timer.isRunning);
            done();
        });

        test("Waiting until work timer is over should switch to pause", (done) => {
            // arrange
            let pomodoro = new Pomodoro(1, 5);
            pomodoro.start();
            assert.equal(PomodoroStatus.Work, pomodoro.status);
            assert.equal(1, pomodoro.timer.currentTime);

            // act
            // assert
            setTimeout(() => {
                assert.equal(PomodoroStatus.Pause, pomodoro.status);
                assert.equal(5, pomodoro.timer.currentTime);
                assert.equal(true, pomodoro.timer.isRunning);
                done();
            }, 1000); // after 1 second
        });

        test("Waiting until pause timer is over should switch to done", (done) => {
            // arrange
            let pomodoro = new Pomodoro(1, 1);
            pomodoro.start();

            // act
            // assert
            setTimeout(() => {
                assert.equal(PomodoroStatus.Pause, pomodoro.status);
                setTimeout(() => {
                    assert.equal(PomodoroStatus.Done, pomodoro.status);
                    assert.equal(false, pomodoro.timer.isRunning);
                    done();
                }, 1000); // after another 1 second
            }, 1000); // after 1 second
        });

        test("Pausing a working Pomodoro should switch to wait", (done) => {
            // arrange
            let pomodoro = new Pomodoro();
            pomodoro.start();

            // act
            // assert
            setTimeout(() => {
                pomodoro.pause();
                assert.equal(PomodoroStatus.Wait, pomodoro.status);
                assert.equal(25 * 60 - 1, pomodoro.timer.currentTime);
                assert.equal(false, pomodoro.timer.isRunning);
                done();
            }, 1000); // after 1 second
        });

        test("Resetting a working Pomodoro should stop Pomodoro and put default time", (done) => {
            // arrange
            let pomodoro = new Pomodoro();
            pomodoro.start();

            // act
            // assert
            setTimeout(() => {
                pomodoro.reset();
                assert.equal(PomodoroStatus.None, pomodoro.status);
                assert.equal(25 * 60, pomodoro.timer.currentTime);
                assert.equal(false, pomodoro.timer.isRunning);
                done();
            }, 1000); // after 1 second
        });

        test("Disposing a working Pomodoro should stop Pomodoro", (done) => {
            // arrange
            let pomodoro = new Pomodoro();
            pomodoro.start();

            // act
            // assert
            setTimeout(() => {
                pomodoro.dispose();
                assert.equal(PomodoroStatus.None, pomodoro.status);
                assert.equal(false, pomodoro.timer.isRunning);
                done();
            }, 1000); // after 1 second
        });

        test("Starting again a Pomodoro after a pause should switch to work", (done) => {
            // arrange
            let pomodoro = new Pomodoro();
            pomodoro.start();

            // act
            // assert
            setTimeout(() => {
                pomodoro.pause();
                pomodoro.start();
                setTimeout(() => {
                    assert.equal(PomodoroStatus.Work, pomodoro.status);
                    assert.equal(25 * 60 - 2, pomodoro.timer.currentTime);
                    assert.equal(true, pomodoro.timer.isRunning);
                    done();
                }, 1000); // after another 1 second
            }, 1000); // after 1 second
        });
    });

    suite('PomodoroManager tests', () => {
        test("A default PomodoroManager should have a single Pomodoro", (done) => {
            // arrange
            let pomodoroManager = new PomodoroManager();

            // act
            // assert
            assert.equal(pomodoroManager.pomodori.length, 1);
            assert.strictEqual(pomodoroManager.pomodori[0], pomodoroManager.currentPomodoro);
            assert.equal(pomodoroManager.currentPomodoro.workTime, 25 * 60);
            assert.equal(pomodoroManager.currentPomodoro.pauseTime, 5 * 60);
            done();
        });

        test("A custom PomodoroManager should have two Pomodori", (done) => {
            // arrange
            let configuration: IPomodoroConfig[] = [
                {
                    work: 25,
                    pause: 5
                },
                {
                    work: 25,
                    pause: 5
                }
            ];
            let pomodoroManager = new PomodoroManager(configuration);

            // act
            // assert
            assert.equal(pomodoroManager.pomodori.length, 2);
            done();
        });

        test("Starting a PomodoroManager should update status of the first Pomodoro", (done) => {
            // arrange
            let pomodoroManager = new PomodoroManager();

            // act
            pomodoroManager.start();

            // assert
            assert.equal(PomodoroStatus.Work, pomodoroManager.currentPomodoro.status);
            assert.equal(25 * 60, pomodoroManager.currentPomodoro.timer.currentTime);
            assert.equal(true, pomodoroManager.currentPomodoro.timer.isRunning);
            done();
        });

        test("Pausing a PomodoroManager should switch current Pomodoro to wait", (done) => {
            // arrange
            let pomodoroManager = new PomodoroManager();
            pomodoroManager.start();

            // act
            // assert
            setTimeout(() => {
                pomodoroManager.pause();
                assert.equal(PomodoroStatus.Wait, pomodoroManager.currentPomodoro.status);
                assert.equal(25 * 60 - 1, pomodoroManager.currentPomodoro.timer.currentTime);
                assert.equal(false, pomodoroManager.currentPomodoro.timer.isRunning);
                done();
            }, 1000); // after 1 second
        });

        test("Resetting a PomodoroManager should reinitialize PomodoroManager", (done) => {
            // arrange
            let pomodoroManager = new PomodoroManager();
            pomodoroManager.start();

            // act
            // assert
            setTimeout(() => {
                pomodoroManager.reset();
                assert.equal(PomodoroStatus.None, pomodoroManager.currentPomodoro.status);
                assert.equal(false, pomodoroManager.currentPomodoro.timer.isRunning);
                done();
            }, 1000); // after 1 second
        });

        test("The end of the first Pomodoro should start the next Pomodoro", (done) => {
            // arrange
            let configuration: IPomodoroConfig[] = [
                {
                    work: 1 / 60,
                    pause: 1 / 60
                },
                {
                    work: 1 / 60,
                    pause: 1 / 60
                }
            ];
            let pomodoroManager = new PomodoroManager(configuration);

            // act
            pomodoroManager.start();

            // assert
            setTimeout(() => {
                setTimeout(() => {
                    assert.strictEqual(pomodoroManager.currentPomodoro, pomodoroManager.pomodori[1]);
                    assert.equal(pomodoroManager.currentPomodoro.status, PomodoroStatus.Work);
                    done();
                }, 1000); // after another 1 second
            }, 1000); // after 1 second
        });

        test("The end of the last Pomodoro should stop the PomodoroManager", (done) => {
            // arrange
            let configuration: IPomodoroConfig[] = [
                {
                    work: 1 / 60,
                    pause: 1 / 60
                },
                {
                    work: 1 / 60,
                    pause: 1 / 60
                }
            ];
            let pomodoroManager = new PomodoroManager(configuration);

            // act
            pomodoroManager.start();

            // assert
            setTimeout(() => {
                assert.equal(pomodoroManager.currentPomodoro, null);
                done();
            }, 4500); // after almost 4 seconds
        });
        
        test("Starting a new session in PomodoroManager should start the first Pomodoro of the new session", (done) => {
            // arrange
            let configuration: IPomodoroConfig[] = [
                {
                    work: 1 / 60,
                    pause: 1 / 60
                },
                {
                    work: 1 / 60,
                    pause: 1 / 60
                }
            ];
            let pomodoroManager = new PomodoroManager(configuration);

            // act
            pomodoroManager.start();

            // assert
            setTimeout(() => {
                pomodoroManager.start();
                assert.equal(pomodoroManager.currentPomodoro, pomodoroManager.pomodori[0]);
                assert.equal(pomodoroManager.currentPomodoro.status, PomodoroStatus.Work);
                done();
            }, 4500); // after almost 4 seconds
        });
    });

});