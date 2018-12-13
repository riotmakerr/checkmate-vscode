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

        // TODO if batchable file just run that
        if (uri && uri.fsPath) {
            console.log('this is coming from a file');

            const fileBuf = fs.readFileSync(uri.fsPath);
            const fileStr = fileBuf.toString().toLowerCase();

            console.log('fileStr', fileStr);

            const match = fileStr.match(/class ([A-Za-z]+) implements.*batchable/g);

            if (match) {
                const matchResult = match[0].split(' ');


                let next: boolean = false;
                let className: string = '';

                for (let i = 0; i < matchResult.length; i++) {
                    if (next) {
                        className = matchResult[i];
                        break;
                    } else if (matchResult[i] === 'class') {
                        next = true;
                    }
                }

                if (className === '') {
                    vscode.window.showErrorMessage('No class name found');
                    return;
                }

                const jobName = await vscode.window.showInputBox({ prompt: "Enter the name of the job" });

                if (jobName) {
                    const schedule = await vscode.window.showInputBox({ prompt: "Enter schedule, or leave blank if none" });
                    const file = formatFile(className, jobName, schedule || '');

                    executeBatch(file);
                }
            } else {
                vscode.window.showErrorMessage('This is not a batchable class!');
            }
        } else {
            // otherwise do specification

            const jobName = await vscode.window.showInputBox({ prompt: "Enter the name of the job" });

            if (jobName) {
                const className = await vscode.window.showInputBox({ prompt: "Enter the name of the class to run" });

                if (className) {
                    const schedule = await vscode.window.showInputBox({ prompt: "Enter schedule, or leave blank if none" });
                    const file = formatFile(className, jobName, schedule || '');

                    executeBatch(file);
                }
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

function formatFile(className: string, jobName: string, schedule: string) {
    return `${className} scheduledJob = new ${className}();\nSystem.schedule(${jobName}, '${schedule}', scheduledJob);`;
}