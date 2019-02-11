'use strict';
import * as fs from 'fs';
import * as timers from 'timers';
import * as vscode from 'vscode';
import { PyPreferencesAPI } from './pypreferencesapi';

export function getIsWindows(): boolean {
  const nodePlatform: NodeJS.Platform = process.platform;
  return nodePlatform === 'win32';
}

export async function getClassName(): Promise<string | undefined> {
  const promptString = 'Please enter a class name';
  const className = await vscode.window.showInputBox({
    prompt: promptString,
    validateInput: (s) => {
      const match = s.match('^([a-zA-Z_]{1}[a-zA-Z0-9_]*)$');
      if (match === null || match.length === 0) {
        return 'Invalid Classname';
      }
      return undefined;
    },
  });
  return className;
}

export async function getPackageName(): Promise<string | undefined> {
  const promptString = 'Please enter a package name';
  const packageName = await vscode.window.showInputBox({
    prompt: promptString,
    validateInput: (s) => {
      const match = s.match('^([a-zA-Z_]{1}[a-zA-Z0-9_]*(\\.[a-zA-Z_]{1}[a-zA-Z0-9_]*)*)$');

      if (match === null || match.length === 0) {
        return 'Invalid Package Name';
      }

      return undefined;
    },
  });
  return packageName;
}

export function readFileAsync(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export function promisifyReadFile(filename: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
      fs.readFile(filename, 'utf8', (err, data) => {
          if (err) {
              reject(err);
          } else {
              resolve(data);
          }
      });
  });
}

export function promisifyWriteFile(filename: string, contents: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
      fs.writeFile(filename, contents, 'utf8', (err) => {
          if (err) {
              reject(err);
          } else {
              resolve();
          }
      });
  });
}

export function promisifyMkDir(dirName: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
      fs.mkdir(dirName, (err) => {
          if (err) {
              reject(err);
          } else {
              resolve();
          }
      });
  });
}

export function promisifyTimer(time: number): Promise<void> {
  return new Promise<void>((resolve, _) => {
      timers.setTimeout(() => {
          resolve();
      }, time);
  });
}

export function getCurrentFileIfPython(): string | undefined {
  const currentEditor = vscode.window.activeTextEditor;
  if (currentEditor === undefined) {
    return undefined;
  }
  if (currentEditor.document.fileName.endsWith('.py')) {
    return currentEditor.document.fileName;
  }
  return undefined;
}

export async function getRunFilePath(
  pyPreferences: PyPreferencesAPI,
  workspace: vscode.WorkspaceFolder,
  source?: vscode.Uri,
): Promise<string | undefined> {
  let file: string;
  if (source === undefined) {
    const cFile = getCurrentFileIfPython();
    if (cFile !== undefined) {
      file = cFile;
    } else {
      const mFile = await pyPreferences.getPreferences(workspace).getMainFile();
      if (mFile === undefined) {
        return;
      }
      file = mFile;
    }
  } else {
    file = source.fsPath;
  }
  return file;
}
