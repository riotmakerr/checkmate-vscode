'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as rp from 'request-promise'; 

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const scheduleBatchCmd = vscode.commands.registerCommand('extension.scheduleBatch', () => {
        // insert schedule batch 
    });

    const executeBatchCmd = vscode.commands.registerCommand('extension.executeBatch', () => {
        // insert execute batch
    });

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
}

// this method is called when your extension is deactivated
export function deactivate() {
}