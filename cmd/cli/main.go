package main

import (
	"flag"
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

	log.Printf("is valid? %v", err)
	log.Printf("pipelines: %v", cfg.Pipelines)
}
