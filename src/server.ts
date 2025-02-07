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
    console.log("connected", client.request.client_id);
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

    client.on("cancellesd", () => {
      console.log("disconnect client", client.request.client_id);
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
