'use strict';
import * as vscode from 'vscode';

// This file is designed to be copied into an
// external project to support the extension API
export interface IPreferencesChangedPair {
  workspace: vscode.WorkspaceFolder;
  preference: IPreferences;
}

export interface ICreatorQuickPick extends vscode.QuickPickItem {
  creator: IExampleTemplateCreator;
}

export interface IVersionable {
  getVersion(): number;
}

const toolAPIExpectedVersion = 1;
export function getToolAPIExpectedVersion(): number {
  return toolAPIExpectedVersion;
}
export abstract class IToolAPI implements IVersionable {
  public abstract startTool(): Promise<boolean>;
  public abstract addTool(tool: IToolRunner): void;
  public getVersion(): number {
    return toolAPIExpectedVersion;
  }
}

const executeAPIExpectedVersion = 1;
export function getExecuteAPIExpectedVersion(): number {
  return executeAPIExpectedVersion;
}
export abstract class IExecuteAPI implements IVersionable {
  public abstract executeCommand(command: string, name: string, rootDir: string, workspace: vscode.WorkspaceFolder): Promise<number>;
  public abstract cancelCommands(): Promise<number>;
  public getVersion(): number {
    return executeAPIExpectedVersion;
  }
}

const exampleTemplateAPIExpectedVersion = 1;
export function getExampleTemplateAPIExpectedVersion(): number {
  return exampleTemplateAPIExpectedVersion;
}
export abstract class IExampleTemplateAPI implements IVersionable {
  public abstract addTemplateProvider(provider: IExampleTemplateCreator): void;
  public abstract addExampleProvider(provider: IExampleTemplateCreator): void;
  public abstract getLanguages(template: boolean): string[];
  public abstract getBases(template: boolean, language: string): ICreatorQuickPick[];
  public abstract createProject(template: boolean, language: string, base: string, toFolder: string,
                                newFolder: boolean, projectName: string, teamNumber: number): Promise<boolean>;
  public getVersion(): number {
    return exampleTemplateAPIExpectedVersion;
  }
}

const commandAPIExpectedVersion = 1;
export function getCommandAPIExpectedVersion(): number {
  return exampleTemplateAPIExpectedVersion;
}
export abstract class ICommandAPI implements IVersionable {
  public abstract addCommandProvider(provider: ICommandCreator): void;
  public abstract createCommand(workspace: vscode.WorkspaceFolder, folder: vscode.Uri): Promise<boolean>;
  public getVersion(): number {
    return commandAPIExpectedVersion;
  }
}

const deployDebugAPIExpectedVersion = 1;
export function getDeployDebugAPIExpectedVersion(): number {
  return deployDebugAPIExpectedVersion;
}
export abstract class IDeployDebugAPI implements IVersionable {
  public abstract startRioLog(teamNumber: number, show: boolean): Promise<boolean>;
  public abstract deployCode(workspace: vscode.WorkspaceFolder, source: vscode.Uri | undefined): Promise<boolean>;
  public abstract registerCodeDeploy(deployer: ICodeDeployer): void;
  public abstract debugCode(workspace: vscode.WorkspaceFolder, source: vscode.Uri | undefined): Promise<boolean>;
  public abstract registerCodeDebug(deployer: ICodeDeployer): void;
  public abstract simulateCode(workspace: vscode.WorkspaceFolder, source: vscode.Uri | undefined): Promise<boolean>;
  public abstract registerCodeSimulate(deployer: ICodeDeployer): void;
  public abstract addLanguageChoice(language: string): void;
  public abstract getLanguageChoices(): string[];
  public getVersion(): number {
    return deployDebugAPIExpectedVersion;
  }
}

const buildTestAPIExpectedVersion = 1;
export function getBuildTestAPIExpectedVersion(): number {
  return deployDebugAPIExpectedVersion;
}
export abstract class IBuildTestAPI implements IVersionable {
  public abstract buildCode(workspace: vscode.WorkspaceFolder, source: vscode.Uri | undefined): Promise<boolean>;
  public abstract registerCodeBuild(builder: ICodeBuilder): void;
  public abstract testCode(workspace: vscode.WorkspaceFolder, source: vscode.Uri | undefined): Promise<boolean>;
  public abstract registerCodeTest(builder: ICodeBuilder): void;
  public abstract addLanguageChoice(language: string): void;
  public getVersion(): number {
    return buildTestAPIExpectedVersion;
  }
}

const preferencesAPIExpectedVersion = 1;
export function getPreferencesAPIExpectedVersion(): number {
  return preferencesAPIExpectedVersion;
}
export abstract class IPreferencesAPI implements IVersionable {
  public abstract onDidPreferencesFolderChanged: vscode.Event<IPreferencesChangedPair[]>;
  public abstract getPreferences(workspace: vscode.WorkspaceFolder): IPreferences;
  public abstract getFirstOrSelectedWorkspace(): Promise<vscode.WorkspaceFolder | undefined>;
  public getVersion(): number {
    return preferencesAPIExpectedVersion;
  }
}

const externalAPIExpectedVersion = 1;
export function getExternalAPIExpectedVersion(): number {
  return externalAPIExpectedVersion;
}
export abstract class IExternalAPI implements IVersionable {
  public abstract getToolAPI(): IToolAPI;
  public abstract getExampleTemplateAPI(): IExampleTemplateAPI;
  public abstract getDeployDebugAPI(): IDeployDebugAPI;
  public abstract getBuildTestAPI(): IBuildTestAPI;
  public abstract getPreferencesAPI(): IPreferencesAPI;
  public abstract getCommandAPI(): ICommandAPI;
  public abstract getExecuteAPI(): IExecuteAPI;
  public getVersion(): number {
    return externalAPIExpectedVersion;
  }
}

export interface IPreferences {
  getTeamNumber(): Promise<number>;
  setTeamNumber(teamNumber: number): Promise<void>;
  getCurrentLanguage(): string;
  setCurrentLanguage(language: string): Promise<void>;
  getAutoStartRioLog(): boolean;
  setAutoStartRioLog(autoStart: boolean, global: boolean): Promise<void>;
  getAutoSaveOnDeploy(): boolean;
  setAutoSaveOnDeploy(autoSave: boolean, global: boolean): Promise<void>;
  getIsWPILibProject(): boolean;
  getOnline(): boolean;
  getSkipTests(): boolean;
  getStopSimulationOnEntry(): boolean;
  getAdditionalGradleArguments(): string;
  setOnline(value: boolean, global: boolean): Promise<void>;
  setSkipTests(value: boolean, global: boolean): Promise<void>;
  setStopSimulationOnEntry(value: boolean, global: boolean): Promise<void>;
}

export interface IExampleTemplateCreator {
  getLanguage(): string;
  getDisplayName(): string;
  getDescription(): string;
  generate(folderInto: vscode.Uri): Promise<boolean>;
}

export interface ICommandCreator {
  getLanguage(): string;
  getDisplayName(): string;
  getDescription(): string;
  getIsCurrentlyValid(workspace: vscode.WorkspaceFolder): Promise<boolean>;
  generate(folder: vscode.Uri, workspace: vscode.WorkspaceFolder): Promise<boolean>;
}

export interface IToolRunner {
  runTool(): Promise<boolean>;
  getDisplayName(): string;
  getDescription(): string;
}

/**
 * Interface to providing a code deployer or debugger
 * to the core plugin.
 */
export interface ICodeDeployer {
  /**
   * Returns if this deployer is currently valid to be used
   * in the current workspace
   */
  getIsCurrentlyValid(workspace: vscode.WorkspaceFolder): Promise<boolean>;
  /**
   * Run the command with the specified team number
   *
   * @param teamNumber The team number to deploy to
   */
  runDeployer(teamNumber: number, workspace: vscode.WorkspaceFolder, source: vscode.Uri | undefined): Promise<boolean>;

  /**
   * Get the display name to be used for selection
   */
  getDisplayName(): string;
  getDescription(): string;
}

/**
 * Interface to providing a code deployer or debugger
 * to the core plugin.
 */
export interface ICodeBuilder {
  /**
   * Returns if this deployer is currently valid to be used
   * in the current workspace
   */
  getIsCurrentlyValid(workspace: vscode.WorkspaceFolder): Promise<boolean>;
  /**
   * Run the command with the specified team number
   */
  runBuilder(workspace: vscode.WorkspaceFolder, source: vscode.Uri | undefined): Promise<boolean>;

  /**
   * Get the display name to be used for selection
   */
  getDisplayName(): string;
  getDescription(): string;
}
