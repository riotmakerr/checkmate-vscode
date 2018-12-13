'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as rp from 'request-promise';
import * as fs from 'fs';
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
                const file = `${batchName} scheduledJob = new ${batchName}();\nSystem.schedule(${jobnName}, '${schedule}', scheduledJob);`

                executeBatch(file);
            }
        }
    })

    const insertAssetLibCmd = vscode.commands.registerCommand('extension.insertFromAssetLibrary', () => {
        //var base64auth = btoa('kbhas:G4tLPa8nxhgQMxd9EHdD');
        var options = {
            uri: 'https://api.bitbucket.org/2.0/repositories/acumensolutions/assetlibrary/src/master/apex/common/SObjectUtility.cls',
            headers: {
                'Content-Type': 'application/text',
                'Authorization': 'Basic a2JoYXM6RzR0TFBhOG54aGdRTXhkOUVIZEQ='
            }
        };

        rp(options)
            .then((response) => console.log('here? - ' + response))
            .catch(err => console.error('it failed!', err));
        // curl -u kbhas:G4tLPa8nxhgQMxd9EHdD -X GET -H "Content-Type: application/json" https://api.bitbucket.org/2.0/repositories/acumensolutions/assetlibrary/src/master/apex/common/SObjectUtility.cls
    });

    context.subscriptions.push(scheduleBatchCmd, executeBatchCmd, insertAssetLibCmd);
}

// this method is called when your extension is deactivated
export function deactivate() {
}