'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as rp from 'request-promise';
import { scheduleBatch, executeBatch } from './commands';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const scheduleBatchCmd = vscode.commands.registerCommand('extension.scheduleBatch', (uri: vscode.Uri) => {
        // insert schedule batch 

        vscode.window.showInputBox({ prompt: "Enter the cron schedule, or leave blank if none" })
            .then(input => {
                if (input) {
                    scheduleBatch(uri.path, input);
                }
            });
    });

    const executeBatchCmd = vscode.commands.registerCommand('extension.executeBatch', async (uri: vscode.Uri) => {
        // insert execute batch

        const jobnName = await vscode.window.showInputBox({ prompt: "Enter the name of the job" });

        if (jobnName) {
            const batchName = await vscode.window.showInputBox({ prompt: "Enter the name of the batch job to run" });

            if (batchName) {
                const schedule = await vscode.window.showInputBox({ prompt: "Enter schedule, or leave blank if none" });
                const file = `${batchName} scheduledJob = new ${batchName}();\nSystem.schedule(${jobnName}, '${schedule}', scheduledJob);`;

                executeBatch(file);
            }
        }
    });

    const insertAssetLibCmd = vscode.commands.registerCommand('extension.insertFromAssetLibrary', () => {

        const baseURI = 'https://api.bitbucket.org/2.0/repositories/acumensolutions/assetlibrary/src/master/apex/common';

        let options = {
            uri: baseURI,
            headers: {
                'Content-Type': 'application/text',
                'Authorization': 'base64 of user:pass here'
            }
        };

        let picklist:string[] = [];

        rp(options)
           .then((response) => {
               let jsonobj = JSON.parse(response);
               for(let value of jsonobj.values) {
                   picklist.push(value.path.substring(value.path.lastIndexOf('/') + 1));
               }
            })
            .then((response) => {
                vscode.window.showQuickPick(picklist).then(value => {
                    if (!value) {
                        return;
                    }
                    console.log(value);

                    options.uri = baseURI + '/' + value;
                    rp(options) 
                    .then((response) => {
                        let editor = vscode.window.activeTextEditor;
                        if (!editor) {
                            return;
                        }
                        console.log(response);
                        const position = editor.selection.active;
                        var we = new vscode.WorkspaceEdit();
                        we.insert(editor.document.uri, position, response);
                        vscode.workspace.applyEdit(we);
                    })
                    .catch(err => console.error('it failed!', err));
                });
            })
           .catch(err => console.error('it failed!', err));
    });

    context.subscriptions.push(scheduleBatchCmd, executeBatchCmd, insertAssetLibCmd);
}

// this method is called when your extension is deactivated
export function deactivate() {
}