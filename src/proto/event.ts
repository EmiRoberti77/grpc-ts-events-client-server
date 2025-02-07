import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { ControllerClient as _EventControllerPackage_ControllerClient, ControllerDefinition as _EventControllerPackage_ControllerDefinition } from './EventControllerPackage/Controller';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  EventControllerPackage: {
    Controller: SubtypeConstructor<typeof grpc.Client, _EventControllerPackage_ControllerClient> & { service: _EventControllerPackage_ControllerDefinition }
    EventMessage: MessageTypeDefinition
    EventRequest: MessageTypeDefinition
  }
}

