'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from 'path';
import * as vscode from 'vscode';
import { BuildTest } from './buildtest';
import { Commands } from './commands';
import { DebugDeploy } from './debugdeploy';
import { Examples } from './examples';
import { IExternalAPI } from './externalapi';
import { PyPreferencesAPI } from './pypreferencesapi';
import { Templates } from './templates';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-wpilib-python" is now active!');

    const baseExtension = vscode.extensions.getExtension<IExternalAPI>('wpifirst.vscode-wpilib');

    if (baseExtension === undefined) {
        await vscode.window.showErrorMessage('No Base WPILib Extension. Please install it');
        return;
    }

    if (!baseExtension.isActive) {
        await baseExtension.activate();
    }

    let allowDebug = true;

    const pythonExtension = vscode.extensions.getExtension('ms-python.python');
    if (pythonExtension === undefined) {
        // TODO: Make this a visible warning message when project detected is java
        console.log('Could not find java extension. Debugging is disabled.');
        allowDebug = false;
    }

    const coreExports = baseExtension.exports;

    const preferences = coreExports.getPreferencesAPI();
    const debugDeployApi = coreExports.getDeployDebugAPI();
    const exampleTemplate = coreExports.getExampleTemplateAPI();
    const commandApi = coreExports.getCommandAPI();
    const buildTestApi = coreExports.getBuildTestAPI();

    const pyPrefs: PyPreferencesAPI = new PyPreferencesAPI();

    const buildTest = new BuildTest(buildTestApi, preferences, pyPrefs);

    context.subscriptions.push(buildTest);

    const debugDeploy = new DebugDeploy(debugDeployApi, preferences, pyPrefs, allowDebug);

    context.subscriptions.push(debugDeploy);

    const extensionResourceLocation = path.join(context.extensionPath, 'resources');

    // Setup commands
    const commands: Commands = new Commands(extensionResourceLocation, commandApi, preferences);
    context.subscriptions.push(commands);

    // Setup examples and template
    const examples: Examples = new Examples(extensionResourceLocation, exampleTemplate);
    context.subscriptions.push(examples);
    const templates: Templates = new Templates(extensionResourceLocation, exampleTemplate);
    context.subscriptions.push(templates);
}

// this method is called when your extension is deactivated
// tslint:disable-next-line:no-empty
export function deactivate() {
}