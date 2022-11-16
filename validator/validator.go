package validator

import (
	"github.com/lightstep/otel-config-validator/configunmarshaler"

	"go.opentelemetry.io/collector/config"
	"go.opentelemetry.io/collector/confmap"
	"gopkg.in/yaml.v3"
)

func IsValid(content []byte) (*config.Config, error) {
	var rawConf map[string]interface{}
	if err := yaml.Unmarshal(content, &rawConf); err != nil {
		return nil, err
	}

	conf := confmap.NewFromStringMap(rawConf)
	factories, err := Components()
	if err != nil {
		return nil, err
	}

	cfg, err := configunmarshaler.New().Unmarshal(conf, factories)
	if err != nil {
		return nil, err
	}

	return cfg, cfg.Validate()
}
