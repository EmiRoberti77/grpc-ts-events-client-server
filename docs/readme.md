# gRPC TypeScript Events Client-Server

This project implements a gRPC client-server architecture using TypeScript. It includes a protobuf definition (`event.proto`), a gRPC server (`server.ts`), and a gRPC client (`client.ts`).

## What is gRPC?

gRPC (gRPC Remote Procedure Calls) is an open-source framework developed by Google for efficient, high-performance communication between distributed systems. It enables clients and servers to communicate using defined service contracts, ensuring structured, typed interactions. Unlike traditional RESTful APIs, gRPC uses Protocol Buffers (protobuf) to define services, leading to smaller message sizes, faster communication, and support for multiple programming languages.

### Key Features of gRPC:

- **Efficient Binary Serialization**: Uses Protocol Buffers instead of JSON or XML.
- **Cross-Language Support**: Works with multiple languages including TypeScript, Python, Go, and Java.
- **Streaming Support**: Supports unary, client, server, and bidirectional streaming.
- **Automatic Code Generation**: Provides client and server stubs using `.proto` files.
- **Authentication & Security**: Supports TLS encryption and authentication mechanisms.

## Streaming Events with gRPC

This implementation leverages gRPC's **constant event streaming** capabilities. Instead of processing isolated requests, the system continuously listens for incoming events and forwards them in real-time. This is particularly beneficial for use cases such as:

- **Real-time analytics**
- **Live notifications**
- **Event-driven microservices**

The client establishes a persistent connection to the server, ensuring that events are received and processed as soon as they are emitted, reducing latency compared to traditional polling approaches.

## Project Structure

```
├── src/
│   ├── proto/
│   │   ├── event.proto
│   ├── server.ts
│   ├── client.ts
├── package.json
├── tsconfig.json
├── .gitignore
```

## Files Overview

### 1. `.gitignore`

Defines files and directories to be ignored by Git.

### 2. `package.json`

Contains dependencies and scripts for the project.

### 3. `package-lock.json`

Locks the dependency versions.

### 4. `tsconfig.json`

Defines TypeScript configuration for compiling the project.

### 5. `src/proto/event.proto`

Protocol Buffers (protobuf) file defining the gRPC service and message structure.

**Example:**

```proto
syntax = "proto3";
package events;

service EventService {
    rpc SendEvent (EventRequest) returns (EventResponse);
}

message EventRequest {
    string eventName = 1;
    string eventData = 2;
}

message EventResponse {
    string message = 1;
}
```

### 6. `src/server.ts`

Implements the gRPC server, loads the protobuf definitions, and listens for client requests.

**How It Works:**

1. Loads the `.proto` definitions using `proto-loader`.
2. Creates an instance of a gRPC server.
3. Adds the `EventService` implementation, defining the `SendEvent` method.
4. Binds to a port (`50051`) and listens for incoming client requests.
5. Maintains a constant stream of events.

**Example:**

```typescript
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { EventMessage } from "./proto/EventControllerPackage/EventMessage";
import path from "path";
import fs from "fs";
import { ProtoGrpcType } from "./proto/event";

const _PROTO_PATH = path.join(__dirname, "proto", "event.proto");
const found = fs.existsSync(_PROTO_PATH);
console.log(found);

const packageDefinition = protoLoader.loadSync(_PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;
const eventController = grpcObj.EventControllerPackage;

const server = new grpc.Server();

server.addService(eventController.Controller.service, {
  StreamEvent: (client: any) => {
    console.log("Connected", client.request.client_id);
    let count = 0;
    const interval = setInterval(() => {
      const response: EventMessage = {
        id: client.clientId,
        message: JSON.stringify({ message: (count += 1) }),
        timeStamp: new Date().toISOString(),
      };
      client.write(response);
      if (count > 5) {
        clearInterval(interval);
        client.end();
      }
    }, 2000);

    client.on("cancelled", () => {
      console.log("Disconnected client", client.request.client_id);
    });
  },
});

const PORT = 50051;
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("gRPC server running on PORT", PORT);
  }
);
```

### 7. `src/client.ts`

Implements a gRPC client that connects to the server and interacts with its services.

**How It Works:**

1. Loads the `.proto` definitions to create a client instance.
2. Establishes a connection to the gRPC server.
3. Calls the `SendEvent` method, passing structured event data.
4. Logs the response from the server.
5. Maintains a constant connection to process incoming events in real-time.

**Example:**

```typescript
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { ProtoGrpcType } from "./proto/event";
import { EventRequest } from "./proto/EventControllerPackage/EventRequest";

const _PROTO_PATH = path.join(__dirname, "proto", "event.proto");

// Load gRPC service definition
const packageDefinition = protoLoader.loadSync(_PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;
const client = new grpcObj.EventControllerPackage.Controller(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// Call the StreamEvents RPC
const stream = client.StreamEvent({ client_id: "client_emi" } as EventRequest);

stream.on("data", (response: any) => {
  console.log(
    `Received event: ${response.event_id} - ${response.message} at ${response.timestamp}`
  );
});

stream.on("end", () => {
  console.log("Stream ended by server.");
});

stream.on("error", (err: any) => {
  console.error("Error in stream:", err);
});
```

---

## Setup & Installation

### Prerequisites

- Node.js
- TypeScript
- gRPC tools (`@grpc/grpc-js`, `@grpc/proto-loader`)

### Installation

Run the following command to install dependencies:

```sh
npm install
```

### Generating TypeScript Definitions from `.proto`

If you make changes to `event.proto`, regenerate TypeScript definitions:

```sh
npx proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=./src/proto/ ./src/proto/*.proto
```

### Running the Server

```sh
node dist/server.js
```

### Running the Client

```sh
node dist/client.js
```

## Benefits of gRPC Over REST

- **Performance**: Faster due to binary serialization (protobuf) instead of JSON.
- **Strong Typing**: Enforced by Protocol Buffers, reducing runtime errors.
- **Streaming Support**: Allows real-time bidirectional communication.
- **Automatic Code Generation**: Reduces boilerplate code in client-server communication.

## License

This project is open-source and free to use.

## Author

Emi Roberti
