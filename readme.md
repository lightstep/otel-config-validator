## otel-config-validator

> 📣 This project is deprecated. For collector config validation, check out [OTelBin](https://otelbin.io) or, as of early 2024, the collector now natively supports validating configuration [using the `validate` command](https://opentelemetry.io/docs/collector/configuration/#location).

Experimental OpenTelemetry Collector Configuraton Validator. Work-in-progress, currently supports usage:

* In-browser (via WebAssembly), see Demo: [https://lightstep.github.io/otel-config-validator/](https://lightstep.github.io/otel-config-validator/)
* CLI
* Visual Studio Code Extension

### Development: Quick start (WebAssembly)

```
    $ make

    # run local server
    $ go run cmd/server/main.go

    # open a browser to validate using an HTML form
    $ open http://127.0.0.1:8100
```

### How it works

Runs validation on partial subset of exporters, receivers, and processors are supported for now. See `components.go` for full list.

In WebAssembly, some components are not supported because they cannot compile to wasm.

### CLI mode

The validator can be built as a command line utility:

```
    # build cli
    $ go build -o otel-config-validator ./cmd/cli/main.go
    
    #run cli against otel config file
    $ ./otel-config-validator -f /path/to/config
```

Output:

```
    OpenTelemetry Collector Configuration file `test-adot.yml` is valid.


    Pipeline metrics:
      Receivers: [otlp]
      Processors: []
      Exporters: [logging]
    Pipeline traces:
      Receivers: [otlp]
      Processors: []
      Exporters: [awsxray]
```
