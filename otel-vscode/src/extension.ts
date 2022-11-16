// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import * as cp from "child_process";

const execWithStdin = (cmd: string, input: string) =>
  new Promise<string>((resolve, reject) => {
    const script = cp.exec(cmd, (err, out) => {
      if (err) {
        return reject(out);
      }
      return resolve(out);
    });
	script.stdin?.write(input);
	script.stdin?.end();
  });

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // TODO: enable platform-specific extensions: https://github.com/microsoft/vscode-platform-specific-sample

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "otel-vscode" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "otel-vscode.helloWorld",
    async () => {
      // Get the active text editor
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        let document = editor.document;

        const documentText = document.getText();
		try {
			const output = await execWithStdin('/Users/clay.smith/workspace/otel-config-validator/otel-config-validator', documentText);
			if (output.indexOf('is valid') > 0) {
				vscode.window.showInformationMessage("Collector config is valid!");
			} else {
				vscode.window.showWarningMessage(`Collector config is invalid: ${output}`);
			}
		} catch (err) {
			vscode.window.showWarningMessage(`Collector config is invalid: ${err}`);
		}
      }

      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
