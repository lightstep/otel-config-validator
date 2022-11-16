package main

import (
	"flag"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/lightstep/otel-config-validator/validator"
)

func main() {

	filename := flag.String("f", "", "collector yaml file")
	flag.Parse()

	var content []byte
	var err error
	if len(*filename) == 0 {
		fmt.Printf("reading from stdin...\n")
		content, err = io.ReadAll(os.Stdin)
		if err != nil {
			panic(err)
		}
	} else {
		content, err = os.ReadFile(filepath.Clean(*filename))
		if err != nil {
			fmt.Printf("error reading config file: %v", err)
			os.Exit(1)
		}
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
