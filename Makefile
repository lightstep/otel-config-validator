build:
#	go build -o out/conftest cmd/main.go
#	GOARCH=amd64 GOOS=linux go build -o  out/conftest-darwin main.go
	GOOS=js GOARCH=wasm go build -o  assets/conftest.wasm cmd/main.go

build-cli:
	go build -o otel-config-validator ./cmd/cli/main.go