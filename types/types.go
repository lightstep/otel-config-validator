package types

import (
	"encoding/json"
	"fmt"
	"strings"

	"go.opentelemetry.io/collector/config"
)

type PipelineOutput struct {
	Pipelines []*PipelineSummary `json:"pipelines"`
	Error     string             `json:"error"`
	IsValid   bool               `json:"valid"`
	Filename  string             `json:"filename"`
}

type PipelineSummary struct {
	PipelineName string   `json:"name"`
	Receivers    []string `json:"receivers"`
	Processors   []string `json:"processors"`
	Exporters    []string `json:"exporters"`
}

func (po PipelineOutput) JSONString() string {
	poJson, _ := json.Marshal(po)
	return string(poJson)
}

func (po PipelineOutput) String() string {
	var sb strings.Builder
	if po.IsValid {
		sb.WriteString(fmt.Sprintf("OpenTelemetry Collector Configuration file `%s` is valid.\n\n\n", po.Filename))
		for _, p := range po.Pipelines {
			sb.WriteString(fmt.Sprintf("Pipeline %s:\n", p.PipelineName))
			sb.WriteString(fmt.Sprintf("  Receivers: %s\n", p.Receivers))
			sb.WriteString(fmt.Sprintf("  Processors: %s\n", p.Processors))
			sb.WriteString(fmt.Sprintf("  Exporters: %s\n", p.Exporters))
		}
	} else {
		sb.WriteString(fmt.Sprintf("OpenTelemetry Collector Configuration file `%s` is not valid.\n\n\n", po.Filename))
		sb.WriteString(fmt.Sprintf("Error: %s\n", po.Error))
	}
	return sb.String()
}

func NewPipelineOutput(valid bool, filename string, cfg *config.Config, err error) *PipelineOutput {
	po := PipelineOutput{}
	po.IsValid = valid
	if err != nil {
		po.Error = err.Error()
	}
	po.Filename = filename

	if cfg == nil {
		return &po
	}

	for id, v := range cfg.Pipelines {
		po.Pipelines = append(po.Pipelines, NewPipelineSummary(id.String(), v.Receivers, v.Processors, v.Exporters))
	}
	return &po
}

func NewPipelineSummary(name string, r []config.ComponentID, p []config.ComponentID, e []config.ComponentID) *PipelineSummary {
	ps := PipelineSummary{}
	ps.PipelineName = name
	for _, v := range r {
		ps.Receivers = append(ps.Receivers, v.String())
	}
	for _, v := range p {
		ps.Processors = append(ps.Processors, v.String())
	}
	for _, v := range e {
		ps.Exporters = append(ps.Exporters, v.String())
	}
	return &ps
}
