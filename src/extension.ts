// the module 'vscode' contains the VS Code extensibility API
// import the module and reference it with the alias vscode in your code below
import {workspace, window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';
import * as fs from 'fs';

import PomodoroManager = require('./pomodoroManager');
import IPomodoroConfig = require('./pomodoroConfig');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "pomodoro-code" is now active!');

    // read config file to create a new Pomodoro Manager
    let configFilePath = context.extensionPath + '/out/config.json';
    let pomodoroManager: PomodoroManager;

    fs.access(configFilePath, fs.F_OK, function(err) {
        // create Pomodoro Manager with list of Pomodoro
        let config: IPomodoroConfig[];

        if (!err) {
            config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
        }

        pomodoroManager = new PomodoroManager(config);
    });

    // list of commands
    let startDisposable = commands.registerCommand('extension.startPomodoro', () => {
        pomodoroManager.start();
    });

    let stopDisposable = commands.registerCommand('extension.pausePomodoro', () => {
        pomodoroManager.pause();
    });

    let resetDisposable = commands.registerCommand('extension.resetPomodoro', () => {
        pomodoroManager.reset();
    });

    let configureDisposable = commands.registerCommand('extension.configurePomodoro', () => {
        workspace.openTextDocument(configFilePath)
            .then((document) => {
                window.showTextDocument(document);
                window.showInformationMessage("Once you have made the change, please restart.");
            });
    });

    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(pomodoroManager);
    context.subscriptions.push(startDisposable);
    context.subscriptions.push(stopDisposable);
    context.subscriptions.push(resetDisposable);
    context.subscriptions.push(configureDisposable);
}