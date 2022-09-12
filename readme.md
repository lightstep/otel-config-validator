## otel-config-validator

Experimental in-browser OpenTelemetry Collector Configuraton Validator. Work-in-progress.

### Quick start

```
    $ make

    # run local server
    $ go run cmd/server/main.go

    # open a browser to validate using an HTML form
    $ open http://127.0.0.1:8100
```

### How it works

Uses WebAssembly to run the Collector's validation logic in the browser. 🤯