## otel-config-validator

Experimental in-browser OpenTelemetry Collector Configuraton Validator. Work-in-progress.

**Demo**: [https://lightstep.github.io/otel-config-validator/](https://lightstep.github.io/otel-config-validator/)

### Development: Quick start

```
    $ make

    # run local server
    $ go run cmd/server/main.go

    # open a browser to validate using an HTML form
    $ open http://127.0.0.1:8100
```

### How it works

Uses WebAssembly to run the Collector's validation logic in the browser. 🤯

Only a partial subset of exporters, receivers, and processors are supported for now. See `components.go` for full list.

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
    OTEL Config file $FILENAME is valid
    Pipelines: 
    metrics: Receivers = [otlp] , Processors = [batch] , Exporters = [awsemf]
```
