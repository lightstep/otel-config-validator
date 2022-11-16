package main

import (
	"flag"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/lightstep/otel-config-validator/validator"
	"github.com/lightstep/otel-config-validator/version"
)

func main() {

	filename := flag.String("f", "", "collector yaml file")
	ver := flag.Bool("version", false, "prints current version")
	stdin := flag.Bool("stdin", false, "read from stdin")

	flag.Parse()

	if *ver {
		fmt.Printf("otel-config-validator version: %v\n", version.ValidatorVersion)
		os.Exit(0)
	}

	var content []byte
	var err error
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
	if cfg == nil {
		fmt.Printf("error reading config file: %v", err)
		os.Exit(1)
	}

	if err != nil {
		fmt.Printf("%v", err)
		os.Exit(1)
	}

	fmt.Printf("OTEL Config file %v is valid\n", *filename)
	fmt.Println("Pipelines: ")
	for i, v := range cfg.Pipelines {
		fmt.Printf("%s: Receivers = %s , Processors = %s , Exporters = %s\n", i, v.Receivers, v.Processors, v.Exporters)
	}
}
