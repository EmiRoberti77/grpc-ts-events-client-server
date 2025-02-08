// Create gRPC client
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import fs from "fs";
import { ProtoGrpcType } from "./proto/event";
import { EventRequest } from "./proto/EventControllerPackage/EventRequest";

const _PROTO_PATH = path.join(__dirname, "proto", "event.proto");
const rootCert = fs.readFileSync(path.join(__dirname, "..", "certs", "ca.crt"));

// Load gRPC service definition
const packageDefinition = protoLoader.loadSync(_PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;
const client = new grpcObj.EventControllerPackage.Controller(
  "localhost:50051",
  grpc.credentials.createSsl(rootCert)
);
const eventRequest: EventRequest = {
  clientId: "emi_client",
};
// Call the StreamEvents RPC
const stream = client.StreamEvent(eventRequest);

stream.on("data", (response: any) => {
  console.log(
    `Received event: ${response.id} - ${response.message} at ${response.timeStamp}`
  );
});

stream.on("end", () => {
  console.log("Stream ended by server.");
});

stream.on("error", (err: any) => {
  console.error("Error in stream:", err);
});
