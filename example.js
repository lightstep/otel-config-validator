window.README_DOC = `

# OpenTelemetry Collector Generated Configuration

### Usage: Plain external OTLP Endpoint

\`
    export OTEL_EXPORTER_OTLP_INSECURE=false|true
    export OTEL_EXPORTER_OTLP_ENDPOINT=your-endpoint:4317
    docker-compose up opentelemetry-collector-contrib
\`

### Usage: Collector with Lightstep Public Satellites 

\`
    export OTEL_EXPORTER_OTLP_INSECURE=false
    export LS_ACCESS_TOKEN=<your-lightstep-token>
    export OTEL_EXPORTER_OTLP_ENDPOINT=ingest.lightstep.com:443
\`

Start Collector and Synthetic Trace Generator:

\`
    docker-compose up opentelemetry-collector-contrib generator
\`

### Usage: Collector with Lightstep Satellite

\`
    export OTEL_EXPORTER_OTLP_INSECURE=true
    export LS_COLLECTOR_SATELLITE_KEY=<your-lightstep-satellite-key>
    export LS_ACCESS_TOKEN=<your-lightstep-token>
    export OTEL_EXPORTER_OTLP_ENDPOINT=satellite:8383
\`

Start Collector, Satellite, and Synthetic Trace Generator:

\`
    docker-compose up opentelemetry-collector-contrib satellite generator
\`
`;

window.DOCKER_COMPOSE_YML = `
version: "3"
services:
  generator:
    image: ghcr.io/lightstep/lightstep-partner-toolkit-collector:latest
    depends_on:
      - opentelemetry-collector-contrib
    environment:
      LS_ACCESS_TOKEN: \${LS_ACCESS_TOKEN}
      OTEL_INSECURE: true
      OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: opentelemetry-collector-contrib:4317
  
  satellite: 
    image: lightstep/microsatellite:latest
    environment:
      - COLLECTOR_SATELLITE_KEY=\${LS_COLLECTOR_SATELLITE_KEY}
      - COLLECTOR_PLAIN_PORT=8383
      - COLLECTOR_SECURE_PORT=9393
      - COLLECTOR_DIAGNOSTIC_PORT=8000
      - COLLECTOR_ADMIN_PLAIN_PORT=8180
    ports:
      - "8383:8383" #Span ingest, Required for unsecure traffic, or secure traffic that terminates it's secure status before it hits the satellite
      - "9393:9393" #Span ingest Required for secure traffic
      - "8000:8000" #Diagnostics
      - "8180:8180" #COLLECTOR_ADMIN_PLAIN_PORT, Required for health checks
  
  opentelemetry-collector-contrib:
    image: otel/opentelemetry-collector-contrib:0.59.0
    command: ["--config=/etc/otel-collector-config.yml"]
    depends_on:
      - satellite
    environment:
      LS_ACCESS_TOKEN: \${LS_ACCESS_TOKEN}
      OTEL_EXPORTER_OTLP_ENDPOINT: \${OTEL_EXPORTER_OTLP_ENDPOINT}
      OTEL_EXPORTER_OTLP_INSECURE: \${OTEL_EXPORTER_OTLP_INSECURE}
    ports:
      - 4317:4317
    volumes:
      - ./otel-collector-config.yaml:/etc/otel-collector-config.yml
`;

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
    endpoint: \${OTEL_EXPORTER_OTLP_ENDPOINT}
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
  memory_limiter:
    check_interval: 1s
    limit_percentage: 50
    spike_limit_percentage: 30

exporters:
  logging:
  otlp/lightstep:
    endpoint: \${OTEL_EXPORTER_OTLP_ENDPOINT}
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