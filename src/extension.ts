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

        const baseURI = 'https://api.bitbucket.org/2.0/repositories/acumensolutions/assetlibrary/src/master/apex/common';

        let options = {
            uri: baseURI,
            headers: {
                'Content-Type': 'application/text',
                'Authorization': 'Basic a2JoYXM6RzR0TFBhOG54aGdRTXhkOUVIZEQ='
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
        

        // curl -u kbhas:G4tLPa8nxhgQMxd9EHdD -X GET -H "Content-Type: application/json" https://api.bitbucket.org/2.0/repositories/acumensolutions/assetlibrary/src/master/apex/common/SObjectUtility.cls
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}