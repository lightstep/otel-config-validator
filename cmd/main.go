package main

import (
	"fmt"
	"syscall/js"

	"github.com/smithclay/conftest/validator"
)

func validateWrapper() js.Func {
	jsonFunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid no of arguments passed"
		}
		inputYAML := args[0].String()
		fmt.Printf("input %s\n", inputYAML)
		cfg, err := validator.IsValid([]byte(inputYAML))
		if cfg == nil {
			fmt.Printf("unable to parse YAML %s\n", err)
			return err.Error()
		}
		if err == nil {
			return ""
		}

		return err.Error()
	})
	return jsonFunc
}

func main() {
	fmt.Println("Go WASM Module Loaded")
	js.Global().Set("validateYAML", validateWrapper())
	<-make(chan bool)
}
