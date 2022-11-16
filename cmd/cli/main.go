package main

import (
	"flag"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/lightstep/otel-config-validator/types"
	"github.com/lightstep/otel-config-validator/validator"
	"github.com/lightstep/otel-config-validator/version"
)

func main() {

	filename := flag.String("f", "", "collector yaml file")
	ver := flag.Bool("version", false, "prints current version")
	stdin := flag.Bool("stdin", false, "read from stdin")
	json := flag.Bool("json", false, "output json")

	flag.Parse()

	if *ver {
		fmt.Printf("otel-config-validator version: %v\n", version.ValidatorVersion)
		os.Exit(0)
	}

	isValid := false
	var content []byte
	var err error
	var summary *types.PipelineOutput
	if *stdin {
		content, err = io.ReadAll(os.Stdin)
		if err != nil {
			panic(err)
		}
	} else if len(*filename) > 0 {
		content, err = os.ReadFile(filepath.Clean(*filename))
		if err != nil {
			fmt.Printf("error reading config file: %v", err)
			os.Exit(1)
		}
	} else {
		fmt.Fprintf(os.Stderr, "Usage of %s:\n", os.Args[0])
		flag.PrintDefaults()
		os.Exit(0)
	}

	cfg, err := validator.IsValid(content)
	if cfg != nil && err == nil {
		isValid = true
	}

	summary = types.NewPipelineOutput(isValid, *filename, cfg, err)
	if *json {
		fmt.Printf("%s", summary.JSONString())
	} else {
		fmt.Printf("%s", summary.String())
	}
}
