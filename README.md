# Telecom Cart Experience API - Grenville Eustace

A thin Experience API that powers a telecom cart on top of a non-persistent Salesforce cart context. Built with TypeScript, Express, and layered architecture following clean code principles.

## Architecture

This project follows a **4-layer architecture** for separation of concerns:

```
┌─────────────────────────────────────────────────┐
│  Presentation Layer                             │
│  - Express routes and controllers               │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Application Layer                              │
│  - CartService (orchestration)                  │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Domain Layer                                   │
│  - Cart, CartItem entities (pure functions)     │
│  - Business logic and validation                │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Infrastructure Layer                           │
│  - InMemoryCartRepository                       │
│  - MockSalesforceAdapter                        │
│  - ExpiryScheduler                              │
└─────────────────────────────────────────────────┘
```

### Design Patterns

- **Factory Pattern**: `CartFactory` for consistent cart creation
- **Repository Pattern**: `ICartRepository` for data access abstraction
- **Adapter Pattern**: `MockSalesforceAdapter` implementing `ISalesforceCartClient` interface
- **Value Object**: `CartItem` with immutability and value-based equality
- **Dependency Injection**: All dependencies injected through constructors

## Prerequisites

- Node.js 20+ (required)
- npm or yarn

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Build the project:**
```bash
npm run build
```

## Running the Application

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on port `3000` by default (configurable via environment variables).

## Configuration

Environment variables (optional):

```bash
PORT=3000                    # Server port
CART_EXPIRY_MS=300000       # Cart expiry time in milliseconds (default: 5 minutes)
NODE_ENV=development        # Environment mode
```

## Testing

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test:watch
```

### Run tests with coverage
```bash
npm test:coverage
```

### Type checking (lint)
```bash
npm run lint
```

## API Endpoints

Base URL: `http://localhost:3000`

### 1. Create Cart
```http
POST /cart
```

**Response (201):**
```json
{
  "id": "uuid",
  "contextId": "uuid",
  "items": [],
  "total": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "expiresAt": "2024-01-01T00:05:00.000Z"
}
```

### 2. Add Item to Cart
```http
POST /cart/:id/item
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": "item-1",
  "productId": "prod-123",
  "name": "iPhone 15",
  "type": "phone",
  "price": 999.99,
  "quantity": 1
}
```

**Item types:** `phone`, `plan`, `accessory`

**Response (200):**
```json
{
  "id": "uuid",
  "contextId": "uuid",
  "items": [
    {
      "id": "item-1",
      "productId": "prod-123",
      "name": "iPhone 15",
      "type": "phone",
      "price": 999.99,
      "quantity": 1
    }
  ],
  "total": 999.99,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "expiresAt": "2024-01-01T00:05:00.000Z"
}
```

### 3. Remove Item from Cart
```http
DELETE /cart/:id/item
Content-Type: application/json
```

**Request Body:**
```json
{
  "itemId": "item-1"
}
```

**Response (200):** Updated cart object

### 4. Get Cart
```http
GET /cart/:id
```

**Response (200):** Full cart object with items and total

### 5. Get Cart Total
```http
GET /cart/:id/total
```

**Response (200):**
```json
{
  "cartId": "uuid",
  "total": 999.99
}
```

### 6. Health Check
```http
GET /health
```

**Response (200):**
```json
{
  "status": "ok"
}
```

## Error Responses

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid input or duplicate item |
| 404 | Not Found | Cart does not exist |
| 410 | Gone | Cart has expired |
| 500 | Internal Server Error | Unexpected error |

**Error Response Format:**
```json
{
  "error": "Error message description"
}
```

## Project Structure

```
src/
├── app.ts                              # Express app setup & DI
├── server.ts                           # Entry point
├── config/
│   └── index.ts                        # Configuration
├── routes/
│   └── cart.routes.ts                  # Route definitions
├── controllers/
│   └── CartController.ts               # HTTP handlers
├── services/
│   └── CartService.ts                  # Business logic orchestration
├── domain/
│   ├── Cart.ts                         # Cart entity
│   ├── CartItem.ts                     # CartItem value object
│   ├── CartFactory.ts                  # Factory pattern
│   └── errors/                         # Domain errors
├── infrastructure/
│   ├── ICartRepository.ts              # Repository interface
│   ├── InMemoryCartRepository.ts       # In-memory implementation
│   ├── ISalesforceCartClient.ts        # Salesforce interface
│   ├── MockSalesforceAdapter.ts        # Mock Salesforce adapter
│   └── ExpiryScheduler.ts              # Cart expiry management

tests/
├── unit/
│   ├── domain/                         # Domain layer tests
│   ├── infrastructure/                 # Infrastructure tests
│   └── services/                       # Service tests
└── integration/
    └── cart.routes.test.ts             # End-to-end API tests
```

## Key Features

### Pure Functions & Immutability
Domain entities are immutable and use pure functions:
```typescript
const updatedCart = cart.addItem(item); // Returns new Cart instance
```

### Automatic Cart Expiry
- Carts expire after 5 minutes (configurable)
- Automatic cleanup via `ExpiryScheduler`
- Expired carts return 410 Gone status

### Mock Salesforce Context
- Simulates real Salesforce cart behavior
- Session timeout simulation
- Context-based item management
- Ready for adapter swap to real Salesforce API

### Comprehensive Testing
- Unit tests for all layers
- Integration tests for API endpoints
- Test coverage reporting

## Example Usage

```bash
# 1. Create a cart
curl -X POST http://localhost:3000/cart

# Response: {"id":"123...","contextId":"456...","items":[],"total":0,...}

# 2. Add an item
curl -X POST http://localhost:3000/cart/123.../item \
  -H "Content-Type: application/json" \
  -d '{
    "id": "item-1",
    "productId": "prod-phone-15",
    "name": "iPhone 15",
    "type": "phone",
    "price": 999.99,
    "quantity": 1
  }'

# 3. Get cart total
curl http://localhost:3000/cart/123.../total

# Response: {"cartId":"123...","total":999.99}

# 4. Remove item
curl -X DELETE http://localhost:3000/cart/123.../item \
  -H "Content-Type: application/json" \
  -d '{"itemId":"item-1"}'

# 5. Get full cart
curl http://localhost:3000/cart/123...
```

## Implementation Notes

### Why Adapter Pattern?
The Adapter pattern allows swapping the mock Salesforce client for a real one without changing business logic:

```typescript
// Current: Mock adapter
const salesforceClient = new MockSalesforceAdapter(config.cartExpiryMs);

// Future: Real adapter
const salesforceClient = new RealSalesforceAdapter(salesforceSDK);
```

Both implement `ISalesforceCartClient`, so `CartService` remains unchanged.

### Storage Strategy
In-memory storage via `Map` provides:
- Fast lookups (O(1))
- Simple implementation
- No database overhead
- Easy to swap for Redis/database via Repository pattern

### Validation Strategy
Two-level validation:
1. **Domain level**: `CartItem` validates on construction
2. **Controller level**: Validates required HTTP fields

## Future Enhancements

- Real Salesforce API integration
- Persistent storage (Redis, PostgreSQL)
- Cart recovery/restore
- User authentication
- Rate limiting
- API versioning
- Prometheus metrics
- OpenAPI/Swagger documentation

## License

ISC
