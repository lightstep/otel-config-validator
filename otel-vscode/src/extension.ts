// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import * as cp from "child_process";
import { PipelineProvider } from "./pipeline";
import { CollectorPipeline } from "./types";

const execWithStdin = (cmd: string, input: string) =>
  new Promise<string>((resolve, reject) => {
    const script = cp.exec(cmd, (err, out) => {
      if (err) {
        return reject(err);
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
  console.log("otel-vscode extension is active");

  let pipelineProvider = new PipelineProvider();
  vscode.window.createTreeView("otelCollectorPipeline", {
    treeDataProvider: pipelineProvider,
  });

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "otel-vscode.validateOtelConfig",
    async () => {
      // Get the active text editor
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        let document = editor.document;

        const documentText = document.getText();
        try {
          const output = await execWithStdin(
            '"/Users/clay.smith/workspace/otel-config-validator/out/otel-config-validator" --json --stdin',
            documentText
          );
          const result = JSON.parse(output);
          if (result.valid) {
            vscode.window.showInformationMessage("Collector config is valid!");
            pipelineProvider.refresh(result.pipelines as [CollectorPipeline]);
          } else {
            vscode.window.showWarningMessage(
              `Collector config is invalid: ${result.error}`
            );
            pipelineProvider.refresh([]);
          }
        } catch (err) {
          vscode.window.showWarningMessage(
            `Error validating configuration: ${err}`
          );
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
