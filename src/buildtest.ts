'use strict';

import * as path from 'path';
import * as vscode from 'vscode';
import { IBuildTestAPI, IPreferencesAPI } from 'vscode-wpilibapi';
import { PyPreferencesAPI } from './pypreferencesapi';
import { getRunFilePath } from './utilities';

export class BuildTest {
  constructor(buildTestApi: IBuildTestAPI, preferences: IPreferencesAPI, pyPreferences: PyPreferencesAPI) {
    buildTestApi.addLanguageChoice('python');

    buildTestApi.registerCodeBuild({
      async getIsCurrentlyValid(workspace: vscode.WorkspaceFolder): Promise<boolean> {
        const prefs = preferences.getPreferences(workspace);
        const currentLanguage = prefs.getCurrentLanguage();
        return currentLanguage === 'none' || currentLanguage === 'python';
      },
      async runBuilder(_: vscode.WorkspaceFolder, __: vscode.Uri | undefined): Promise<boolean> {
        await vscode.window.showInformationMessage('You\'re in python, no need to build.');
        return true;
      },
      getDisplayName(): string {
        return 'python';
      },
      getDescription(): string {
        return 'Python Build';
      },
    });

    buildTestApi.registerCodeTest({
      async getIsCurrentlyValid(workspace: vscode.WorkspaceFolder): Promise<boolean> {
        const prefs = preferences.getPreferences(workspace);
        pyPreferences.getPreferences(workspace);
        const currentLanguage = prefs.getCurrentLanguage();
        return currentLanguage === 'none' || currentLanguage === 'python';
      },
      async runBuilder(workspace: vscode.WorkspaceFolder, source?: vscode.Uri): Promise<boolean> {
        const pythonExtension = vscode.extensions.getExtension('ms-python.python');
        if (pythonExtension === undefined) {
          await vscode.window.showInformationMessage('Python extension is not installed. Testing from the menu is disabled.');
          return false;
        }

        let file = await getRunFilePath(pyPreferences, workspace, source);
        if (file === undefined) {
          return false;
        }
        if (!path.isAbsolute(file)) {
          file = path.join(workspace.uri.fsPath, file);
        }

        return vscode.debug.startDebugging(workspace, {
          args: ['test'],
          name: 'WPILib Python Test',
          program: file,
          request: 'launch',
          type: 'python',
        });
      },
      getDisplayName(): string {
        return 'python';
      },
      getDescription(): string {
        return 'Python Test';
      },
    });
  }

  // tslint:disable-next-line:no-empty
  public dispose() {

  }
}
