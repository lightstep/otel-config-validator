import * as vscode from "vscode";
import { Event, EventEmitter } from "vscode";
import { CollectorPipeline } from "./types";

export class PipelineProvider implements vscode.TreeDataProvider<PipelineItem> {
  private pipelineConfig: CollectorPipeline[];
  private viewUpdatedEventEmitter: EventEmitter<PipelineItem | null> =
    new EventEmitter<PipelineItem | null>();
  readonly onDidChangeTreeData: Event<PipelineItem | null> =
    this.viewUpdatedEventEmitter.event;

  constructor() {
    this.pipelineConfig = [];
  }

  refresh(pipelines: CollectorPipeline[]) {
    this.pipelineConfig = pipelines;
    this.viewUpdatedEventEmitter.fire(null);
  }

  getTreeItem(element: PipelineItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: PipelineItem): Thenable<PipelineItem[]> {
    if (this.pipelineConfig.length === 0) {
      return Promise.resolve([]);
    }

    if (element) {
      return Promise.resolve(
        this.getPipelineComponents(element.label, element.pipelineConfig)
      );
    } else {
      return Promise.resolve(this.getPipelineComponents());
    }
  }

  private getPipelineComponents(
    label: string = "",
    pipelineItem: CollectorPipeline | undefined = undefined
  ): PipelineItem[] {
    if (pipelineItem === undefined) {
      return this.pipelineConfig.map(
        (pc) =>
          new PipelineItem(
            pc.name,
            vscode.TreeItemCollapsibleState.Collapsed,
            pc,
            []
          )
      );
    } else if (label === "traces" || label === "metrics" || label === "logs") {
      return [
        new PipelineItem(
          "receivers",
          pipelineItem.receivers
            ? vscode.TreeItemCollapsibleState.Collapsed
            : vscode.TreeItemCollapsibleState.None,
          pipelineItem,
          pipelineItem.receivers
        ),
        new PipelineItem(
          "processors",
          pipelineItem.processors
            ? vscode.TreeItemCollapsibleState.Collapsed
            : vscode.TreeItemCollapsibleState.None,
          pipelineItem,
          pipelineItem.processors
        ),
        new PipelineItem(
          "exporters",
          pipelineItem.exporters
            ? vscode.TreeItemCollapsibleState.Collapsed
            : vscode.TreeItemCollapsibleState.None,
          pipelineItem,
          pipelineItem.exporters
        ),
      ];
    } else if (label === "receivers" && pipelineItem.receivers) {
      return pipelineItem.receivers!.map(
        (pr) =>
          new PipelineItem(
            pr,
            vscode.TreeItemCollapsibleState.None,
            pipelineItem,
            []
          )
      );
    } else if (label === "processors" && pipelineItem.processors) {
      return pipelineItem.processors!.map(
        (pr) =>
          new PipelineItem(
            pr,
            vscode.TreeItemCollapsibleState.None,
            pipelineItem,
            []
          )
      );
    } else if (label === "exporters" && pipelineItem.exporters) {
      return pipelineItem.exporters!.map(
        (pr) =>
          new PipelineItem(
            pr,
            vscode.TreeItemCollapsibleState.None,
            pipelineItem,
            []
          )
      );
    }

    return [];
  }
}

class PipelineItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public pipelineConfig: CollectorPipeline,
    public components: string[] | null
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
    this.description = false;
  }
}
