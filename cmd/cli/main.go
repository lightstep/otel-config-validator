package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/smithclay/conftest/validator"
)

func main() {

	filename := flag.String("f", "", "collector yaml file")
	flag.Parse()

	cfg, err := validator.ValidateConfFromFile(*filename)
	if cfg == nil {
		log.Printf("error reading config file: %v", err)
		return
	}

	if err != nil {
		log.Printf("%v", err)
	}

	fmt.Printf("OTEL Config file %v is valid\n", *filename)
	fmt.Println("Pipelines: ")
	for i, v := range cfg.Pipelines {
		fmt.Printf("%s: Receivers = %s , Processors = %s , Exporters = %s\n", i, v.Receivers, v.Processors, v.Exporters)
	}
}
