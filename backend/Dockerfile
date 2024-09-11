FROM golang:1.21 as build

WORKDIR /go/src/app
COPY . .

RUN export GO111MODULE=on && \
    export GIT_TERMINAL_PROMPT=1 && \
    go mod download

RUN CGO_ENABLED=0 go build -o /go/bin/app


FROM gcr.io/distroless/static-debian11

COPY --from=build /go/bin/app /backend/
COPY .env /backend/.env
COPY ./abi /backend/abi
WORKDIR /backend
CMD ["/backend/app"]

# FROM golang:1.21-bullseye as builder
# WORKDIR /app
# COPY go.mod .
# COPY go.sum .
# RUN go mod download
# COPY . .
# RUN go build -o app

# FROM ubuntu:22.04
# RUN mkdir /app
# WORKDIR /app
# COPY .env .env
# COPY ./abi ./abi
# COPY --from=builder /app/app .
# ENTRYPOINT ["./app"]
