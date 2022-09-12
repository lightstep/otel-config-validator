package validator

import (
	"os"
	"path/filepath"

	"github.com/smithclay/conftest/configunmarshaler"

	"go.opentelemetry.io/collector/component/componenttest"
	"go.opentelemetry.io/collector/config"
	"go.opentelemetry.io/collector/confmap"
	"gopkg.in/yaml.v3"
)

func ValidateConfFromFile(fileName string) (*config.Config, error) {
	// Clean the path before using it.
	content, err := os.ReadFile(filepath.Clean(fileName))
	if err != nil {
		return nil, err
	}

	return IsValid(content)
}

func IsValid(content []byte) (*config.Config, error) {
	var rawConf map[string]interface{}
	if err := yaml.Unmarshal(content, &rawConf); err != nil {
		return nil, err
	}

	conf := confmap.NewFromStringMap(rawConf)
	// TODO: build factories from here: https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/80abcdd25de778d4546c679afba7906fb1639713/internal/components/components.go#L176
	factories, err := componenttest.NopFactories()
	cfg, err := configunmarshaler.New().Unmarshal(conf, factories)
	if err != nil {
		return nil, err
	}

	return cfg, cfg.Validate()
}
