# Nginx API Gateway POC with Node.js Microservices

## Overview

This project demonstrates how to build an API Gateway using Nginx and Node.js microservices.

The objective is to understand the core responsibilities of an API Gateway before moving to enterprise-grade solutions such as Kong Gateway.

Current implementation includes:

- Reverse Proxy
- Route-Based Request Routing
- Header Forwarding
- Load Balancing
- Fault Tolerance
- Centralized Authentication

---

## Architecture

```text
                Client
                   |
                   |
                   v
          Nginx API Gateway
               :8080
                   |
         -----------------------
         |          |          |
         v          v          v
   User Service Product Service Order Service
      :3001         :3002         :3003
         |
         |
         v
   Additional Instances
   :3004, :3005
```

Authentication Flow:

```text
Client
  |
  | Authorization Header
  |
  v
Nginx Gateway
  |
  v
Auth Service (:3006)
  |
  +---- 200 OK ----> Forward Request
  |
  +---- 401 -------> Reject Request
```

---

## Technology Stack

### Backend

- Node.js
- Express.js

### API Gateway

- Nginx

### Authentication

- Custom Auth Service

### Operating System

- Ubuntu

---

## Project Structure

```text
nginx-api-gateway-poc/
│
├── services/
│   ├── user-service/
│   │   └── index.js
│   │
│   ├── product-service/
│   │   └── index.js
│   │
│   ├── order-service/
│   │   └── index.js
│   │
│   └── auth-service/
│       └── index.js
│
└── nginx/
```

---

## Prerequisites

### Verify Node.js

```bash
node -v
```

Expected:

```bash
v20.x.x
```

### Verify npm

```bash
npm -v
```

### Install Nginx

```bash
sudo apt update

sudo apt install nginx -y
```

Verify:

```bash
nginx -v
```

### Start Nginx

```bash
sudo systemctl start nginx

sudo systemctl enable nginx
```

---

## Running Services

### User Service

```bash
PORT=3001 node index.js
```

Additional Instances

```bash
PORT=3004 node index.js

PORT=3005 node index.js
```

### Product Service

```bash
node index.js
```

Runs on:

```text
3002
```

### Order Service

```bash
node index.js
```

Runs on:

```text
3003
```

### Auth Service

```bash
node index.js
```

Runs on:

```text
3006
```

---

## Nginx Configuration

File:

```bash
/etc/nginx/conf.d/api-gateway.conf
```

```nginx
upstream user_service {
    server localhost:3001;
    server localhost:3004;
    server localhost:3005;
}

server {

    listen 8080;

    location = /auth {
        internal;

        proxy_pass http://localhost:3006/validate;

        proxy_pass_request_body off;
        proxy_set_header Content-Length "";
        proxy_set_header Authorization $http_authorization;
    }

    location /users {

        auth_request /auth;

        proxy_pass http://user_service;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /products {

        auth_request /auth;

        proxy_pass http://localhost:3002;
    }

    location /orders {

        auth_request /auth;

        proxy_pass http://localhost:3003;
    }
}
```

Validate Configuration:

```bash
sudo nginx -t
```

Reload:

```bash
sudo systemctl reload nginx
```

---

## API Endpoints

### Users

```http
GET /users
```

### Products

```http
GET /products
```

### Orders

```http
GET /orders
```

Base URL:

```text
http://localhost:8080
```

---

## Authentication

Current implementation uses a simple token validation approach.

Valid Token:

```text
Bearer valid-token
```

### Request Without Token

```bash
curl -i http://localhost:8080/users
```

Response:

```http
401 Unauthorized
```

### Request With Token

```bash
curl -i \
-H "Authorization: Bearer valid-token" \
http://localhost:8080/users
```

Response:

```http
200 OK
```

---

## Load Balancing

Nginx uses Round Robin load balancing.

Configured User Service instances:

```text
3001
3004
3005
```

Verification:

```bash
for i in {1..10}
do
  curl -s \
  -H "Authorization: Bearer valid-token" \
  localhost:8080/users
  echo
done
```

Expected:

```json
{
  "runningOn": 3001
}

{
  "runningOn": 3004
}

{
  "runningOn": 3005
}
```

---

## Features Implemented

| Feature                    | Status |
| -------------------------- | ------ |
| Reverse Proxy              | ✅     |
| API Gateway Routing        | ✅     |
| Header Forwarding          | ✅     |
| Upstreams                  | ✅     |
| Load Balancing             | ✅     |
| Fault Tolerance            | ✅     |
| Centralized Authentication | ✅     |

---

## Future Enhancements

### Phase 3

JWT Authentication

- Access Tokens
- Refresh Tokens
- Role Claims

### Phase 4

Identity Propagation

Headers injected by gateway:

```text
X-User-Id
X-User-Role
```

### Phase 5

Rate Limiting

Examples:

```text
100 Requests / Minute
1000 Requests / Hour
```

### Phase 6

Caching

- Response Caching
- Static Asset Caching

### Phase 7

SSL/TLS

HTTPS Support

```text
http://localhost:8080
        ↓
https://localhost:8443
```

### Phase 8

Docker Compose

Containerize:

- Nginx
- User Service
- Product Service
- Order Service
- Auth Service

### Phase 9

Observability

- Access Logs
- Error Logs
- Metrics
- Health Checks

### Phase 10

Kong Gateway Migration

Replace custom Nginx configuration with Kong.

---

## Kong Gateway Roadmap

### Install Kong

Using Docker:

```bash
docker compose up -d
```

### Configure Services

```text
User Service
Product Service
Order Service
```

### Configure Routes

```text
/users
/products
/orders
```

### Enable Plugins

Authentication:

- JWT
- OAuth2
- Key Authentication

Traffic Control:

- Rate Limiting
- Request Transformation
- Response Transformation

Monitoring:

- Prometheus
- Grafana

### Advanced Topics

- Service Discovery
- Circuit Breakers
- Canary Deployments
- Blue/Green Deployments
- API Versioning

---

## Learning Outcomes

This project demonstrates how API Gateway products such as Kong, APISIX, AWS API Gateway, and NGINX Gateway internally implement:

- Reverse Proxying
- Routing
- Authentication
- Load Balancing
- Traffic Management
- Security Enforcement

Understanding these fundamentals makes it significantly easier to adopt enterprise API Gateway platforms.
