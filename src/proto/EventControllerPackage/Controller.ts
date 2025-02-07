// Original file: src/proto/event.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { EventMessage as _EventControllerPackage_EventMessage, EventMessage__Output as _EventControllerPackage_EventMessage__Output } from '../EventControllerPackage/EventMessage';
import type { EventRequest as _EventControllerPackage_EventRequest, EventRequest__Output as _EventControllerPackage_EventRequest__Output } from '../EventControllerPackage/EventRequest';

export interface ControllerClient extends grpc.Client {
  StreamEvent(argument: _EventControllerPackage_EventRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_EventControllerPackage_EventMessage__Output>;
  StreamEvent(argument: _EventControllerPackage_EventRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_EventControllerPackage_EventMessage__Output>;
  streamEvent(argument: _EventControllerPackage_EventRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_EventControllerPackage_EventMessage__Output>;
  streamEvent(argument: _EventControllerPackage_EventRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_EventControllerPackage_EventMessage__Output>;
  
}

export interface ControllerHandlers extends grpc.UntypedServiceImplementation {
  StreamEvent: grpc.handleServerStreamingCall<_EventControllerPackage_EventRequest__Output, _EventControllerPackage_EventMessage>;
  
}

export interface ControllerDefinition extends grpc.ServiceDefinition {
  StreamEvent: MethodDefinition<_EventControllerPackage_EventRequest, _EventControllerPackage_EventMessage, _EventControllerPackage_EventRequest__Output, _EventControllerPackage_EventMessage__Output>
}
