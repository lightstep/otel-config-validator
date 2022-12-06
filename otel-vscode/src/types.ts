export interface CollectorPipeline {
    name: string;
    exporters: [string] | null;
    processors: [string] | null;
    receivers: [string] | null;
}