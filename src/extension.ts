'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as rp from 'request-promise';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "checkmate-vscode" is now active!');

    let openable = vscode.commands.registerCommand('extension.newTextFile', () => {
        const newFile = vscode.Uri.parse('untitled:' + path.join(vscode.env.appRoot, 'test.txt'));
        vscode.workspace.openTextDocument(newFile).then(document => {
            const edit = new vscode.WorkspaceEdit();
            edit.insert(newFile, new vscode.Position(0, 0), "Hello world!");
            return vscode.workspace.applyEdit(edit).then(success => {
                if (success) {
                    vscode.window.showTextDocument(document);
                } else {
                    vscode.window.showInformationMessage('Error!');
                }
            });
        });
    });

    const helloServer = vscode.commands.registerCommand('extension.loginToSF', () => {
        rp.get('http://localhost:56248/app/sfdx/authweblogin')
            .then(() => console.log('it worked!'))
            .catch(err => console.error('it failed!', err));
    });

    context.subscriptions.push(openable);
    context.subscriptions.push(helloServer);
}

// this method is called when your extension is deactivated
export function deactivate() {
}