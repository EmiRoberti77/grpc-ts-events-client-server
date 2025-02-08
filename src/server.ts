import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { EventMessage } from "./proto/EventControllerPackage/EventMessage";
import path from "path";
import fs from "fs";
import { ProtoGrpcType } from "./proto/event";
import { EventRequest } from "./proto/EventControllerPackage/EventRequest";

const PORT = 50051;
const PROTO = "proto";
const EVENT_PROTO = "event.proto";
const CONNECTED = "connected";
const CLIENT_DISCONNECTED = "client disconnected";
const GRPC_SERVER_RUNNING = "gRPC server running on PORT";
const HOST = `0.0.0.0:${PORT}`;

const _PROTO_PATH = path.join(__dirname, PROTO, EVENT_PROTO);
const found = fs.existsSync(_PROTO_PATH);
console.log(found);

const packageDefinition = protoLoader.loadSync(_PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;
const eventController = grpcObj.EventControllerPackage;
const server = new grpc.Server();

const activeClients: Map<
  string,
  grpc.ServerWritableStream<any, any>
> = new Map();

function sendEventToClient() {
  console.log("sendToClient");
  console.log("active client size", activeClients.size);

  for (let client of activeClients.values()) {
    const id = client.request.clientId;
    const response: EventMessage = {
      id,
      message: JSON.stringify({ message: id }),
      timeStamp: new Date().toISOString(),
    };
    console.log("sending ..");
    console.log(response);
    client.write(response);
    console.log("sent ..");
  }
}
async function main() {
  server.addService(eventController.Controller.service, {
    StreamEvent: (req: grpc.ServerWritableStream<any, any>) => {
      const client_id = (req.request as EventRequest).clientId;
      console.log("request=", req.request);
      console.log("client_id=", client_id);
      console.log(CONNECTED, client_id);
      if (!client_id) {
        console.log("client id is undefined");
        return;
      }

      activeClients.set(client_id, req);
      console.log(activeClients.size);

      req.on("cancelled", () => {
        console.log(CLIENT_DISCONNECTED, client_id);
        activeClients.delete(client_id);
      });
    },
  });

  server.bindAsync(HOST, grpc.ServerCredentials.createInsecure(), () => {
    console.log(GRPC_SERVER_RUNNING, PORT);
  });
}

function emulateEvent() {
  console.log("emulate event");
  let count = 0;
  const interval = setInterval(() => {
    sendEventToClient();
    console.log("count", count);
    count += 1;
    count === 50 ? clearInterval(interval) : () => console.log(".");
  }, 2000);
}

main();
emulateEvent();
