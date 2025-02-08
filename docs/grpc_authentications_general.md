# gRPC Authentication Methods

## 🔐 1. TLS (Transport Layer Security)

Secure gRPC communication using SSL/TLS certificates.

### ✅ Steps:

1. **Generate SSL/TLS Certificates** (self-signed for testing, CA-signed for production).
2. **Load the Certificates in the Server**.
3. **Configure the gRPC Client to Use TLS**.

### 🔹 Server Implementation:

```typescript
import * as grpc from "@grpc/grpc-js";
import * as fs from "fs";

const server = new grpc.Server();

// Load certificates
const serverCert = fs.readFileSync("certs/server.crt");
const serverKey = fs.readFileSync("certs/server.key");
const rootCert = fs.readFileSync("certs/ca.crt");

// Bind server with credentials
server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createSsl(
    rootCert,
    [{ cert_chain: serverCert, private_key: serverKey }],
    false
  ),
  () => {
    console.log("🔐 Secure gRPC server running on port 50051");
  }
);
```

### 🔹 Client Implementation:

```typescript
import * as grpc from "@grpc/grpc-js";
import * as fs from "fs";

// Load the root certificate
const rootCert = fs.readFileSync("certs/ca.crt");

const client = new grpcObj.EventControllerPackage.Controller(
  "localhost:50051",
  grpc.credentials.createSsl(rootCert)
);
```

---

## 🔑 2. Token-Based Authentication (JWT, API Keys)

Restrict access using **API Keys** or **JWT tokens**.

### ✅ Steps:

1. **Client sends token/API key in metadata**.
2. **Server verifies the token** before processing the request.

### 🔹 Server Implementation:

```typescript
server.addService(eventController.Controller.service, {
  StreamEvent: (call: grpc.ServerWritableStream<any, any>, callback) => {
    // Get metadata (headers)
    const metaData = call.metadata.get("authorization")[0];

    if (!metaData || metaData !== "Bearer my-secret-token") {
      return callback({
        code: grpc.status.UNAUTHENTICATED,
        message: "Invalid or missing token",
      });
    }

    console.log("Authenticated client");
    // Proceed with the request
  },
});
```

### 🔹 Client Implementation:

```typescript
const metadata = new grpc.Metadata();
metadata.add("authorization", "Bearer my-secret-token");

const stream = client.StreamEvent({ client_id: "client_emi" }, metadata);
```

---

## 🔒 3. OAuth 2.0 with gRPC

Use OAuth2 tokens for authentication (Google, Auth0, etc.).

### ✅ Steps:

1. **Client fetches an OAuth token** from an Identity Provider.
2. **Client sends token in metadata**.
3. **Server validates the token**.

### 🔹 Server Implementation:

```typescript
import jwt from "jsonwebtoken";

server.addService(eventController.Controller.service, {
  StreamEvent: (call: grpc.ServerWritableStream<any, any>, callback) => {
    const token = call.metadata.get("authorization")[0]?.split(" ")[1]; // Extract token

    if (!token) {
      return callback({
        code: grpc.status.UNAUTHENTICATED,
        message: "No token provided",
      });
    }

    jwt.verify(token, "YOUR_SECRET_KEY", (err, decoded) => {
      if (err) {
        return callback({
          code: grpc.status.UNAUTHENTICATED,
          message: "Invalid token",
        });
      }
      console.log("Authenticated user:", decoded);
      // Continue with the request
    });
  },
});
```

### 🔹 Client Implementation:

```typescript
const metadata = new grpc.Metadata();
metadata.add("authorization", "Bearer YOUR_OAUTH_TOKEN");

const stream = client.StreamEvent({ client_id: "client_emi" }, metadata);
```

---

## 🔑 Choosing the Right Authentication Method

| Authentication Method      | Use Case                                              |
| -------------------------- | ----------------------------------------------------- |
| **TLS (SSL Certificates)** | Secure communication (Encryption)                     |
| **API Keys**               | Simple authentication (Non-user based)                |
| **JWT Tokens**             | User-based authentication (OAuth, Identity Providers) |
| **Mutual TLS (mTLS)**      | Two-way authentication (High security)                |

For **enterprise security**, consider **OAuth + TLS**.

---

## 🚀 Conclusion

- Use **TLS** to encrypt communication.
- Use **API Keys or JWT tokens** for authentication.
- Validate **OAuth tokens** if using identity providers.
