window.OTEL_EXAMPLES = {
    "otlp": `receivers:
  otlp:
    protocols:
      grpc:
      http:

processors:
  batch:

exporters:
  otlp:
    endpoint: otelcol:4317
    headers:

extensions:
  health_check:
  zpages:

service:
  extensions: [health_check,zpages]
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
    logs:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
`, 
    "lightstep-rec": `receivers:
    otlp:
      protocols:
        grpc:

processors:
  batch:
  # If set to null, will be overridden with values based on k8s resource limits
  memory_limiter: null

exporters:
  logging:
  otlp/lightstep:
    endpoint: "ingest.lightstep.com:443"
    tls:
        insecure_skip_verify: true
    headers:
      "lightstep-access-token": "\${LS_ACCESS_TOKEN}"

extensions:
  health_check:

service:
  extensions: [health_check]
  pipelines:
    metrics:
      receivers:
      - otlp
      processors:
      - memory_limiter
      - batch
      exporters:
      - otlp/lightstep
      - logging

    traces:
      receivers:
      - otlp
      processors:
      - memory_limiter
      - batch
      exporters:
      - logging
      - otlp/lightstep
`
}