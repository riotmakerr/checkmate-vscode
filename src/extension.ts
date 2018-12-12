'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const scheduleBatchCmd = vscode.commands.registerCommand('extension.scheduleBatch', () => {
        // insert schedule batch 
    });

    const executeBatchCmd = vscode.commands.registerCommand('extension.executeBatch', () => {
        // insert execute batch
    })

    const insertAssetLibCmd = vscode.commands.registerCommand('extension.insertFromAssetLibrary', () => {
        // insert asset code
        // kevin: feel free to change this as you see fit!
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}