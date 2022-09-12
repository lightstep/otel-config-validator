package validator

import (
	"go.opentelemetry.io/collector/component"
	"go.opentelemetry.io/collector/exporter/otlpexporter"
	"go.opentelemetry.io/collector/exporter/otlphttpexporter"
	"go.opentelemetry.io/collector/extension/zpagesextension"
	"go.opentelemetry.io/collector/processor/batchprocessor"
	"go.opentelemetry.io/collector/processor/memorylimiterprocessor"
	"go.opentelemetry.io/collector/receiver/otlpreceiver"

	"github.com/open-telemetry/opentelemetry-collector-contrib/extension/headerssetter"
	"github.com/open-telemetry/opentelemetry-collector-contrib/extension/healthcheckextension"
	"github.com/open-telemetry/opentelemetry-collector-contrib/processor/attributesprocessor"
	"github.com/open-telemetry/opentelemetry-collector-contrib/processor/cumulativetodeltaprocessor"
	"github.com/open-telemetry/opentelemetry-collector-contrib/processor/deltatorateprocessor"
	"github.com/open-telemetry/opentelemetry-collector-contrib/processor/filterprocessor"
	"github.com/open-telemetry/opentelemetry-collector-contrib/processor/groupbyattrsprocessor"
	"github.com/open-telemetry/opentelemetry-collector-contrib/processor/groupbytraceprocessor"
	"github.com/open-telemetry/opentelemetry-collector-contrib/processor/k8sattributesprocessor"
	"github.com/open-telemetry/opentelemetry-collector-contrib/processor/metricsgenerationprocessor"
	"github.com/open-telemetry/opentelemetry-collector-contrib/processor/metricstransformprocessor"
	"github.com/open-telemetry/opentelemetry-collector-contrib/processor/probabilisticsamplerprocessor"
	"github.com/open-telemetry/opentelemetry-collector-contrib/processor/resourceprocessor"
	"github.com/open-telemetry/opentelemetry-collector-contrib/processor/routingprocessor"
	"github.com/open-telemetry/opentelemetry-collector-contrib/processor/spanmetricsprocessor"
	"github.com/open-telemetry/opentelemetry-collector-contrib/processor/spanprocessor"
	"github.com/open-telemetry/opentelemetry-collector-contrib/processor/tailsamplingprocessor"
	"github.com/open-telemetry/opentelemetry-collector-contrib/processor/transformprocessor"
	"github.com/open-telemetry/opentelemetry-collector-contrib/receiver/otlpjsonfilereceiver"
)

// inspired by: https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/80abcdd25de778d4546c679afba7906fb1639713/internal/components/components.go#L176
func Components() (component.Factories, error) {
	var err error
	factories := component.Factories{}
	extensions := []component.ExtensionFactory{
		headerssetter.NewFactory(),
		healthcheckextension.NewFactory(),
		zpagesextension.NewFactory(),
	}
	factories.Extensions, err = component.MakeExtensionFactoryMap(extensions...)
	if err != nil {
		return component.Factories{}, err
	}

	receivers := []component.ReceiverFactory{
		otlpjsonfilereceiver.NewFactory(),
		otlpreceiver.NewFactory(),
	}
	factories.Receivers, err = component.MakeReceiverFactoryMap(receivers...)
	if err != nil {
		return component.Factories{}, err
	}

	exporters := []component.ExporterFactory{
		otlpexporter.NewFactory(),
		otlphttpexporter.NewFactory(),
	}
	factories.Exporters, err = component.MakeExporterFactoryMap(exporters...)
	if err != nil {
		return component.Factories{}, err
	}

	processors := []component.ProcessorFactory{
		attributesprocessor.NewFactory(),
		batchprocessor.NewFactory(),
		filterprocessor.NewFactory(),
		groupbyattrsprocessor.NewFactory(),
		groupbytraceprocessor.NewFactory(),
		k8sattributesprocessor.NewFactory(),
		memorylimiterprocessor.NewFactory(),
		metricstransformprocessor.NewFactory(),
		metricsgenerationprocessor.NewFactory(),
		probabilisticsamplerprocessor.NewFactory(),
		resourceprocessor.NewFactory(),
		routingprocessor.NewFactory(),
		tailsamplingprocessor.NewFactory(),
		spanmetricsprocessor.NewFactory(),
		spanprocessor.NewFactory(),
		cumulativetodeltaprocessor.NewFactory(),
		deltatorateprocessor.NewFactory(),
		transformprocessor.NewFactory(),
	}
	factories.Processors, err = component.MakeProcessorFactoryMap(processors...)
	if err != nil {
		return component.Factories{}, err
	}

	return factories, nil
}
