######## For Claude Code:
This section outlines the different sections outlined in this document. 

Section 1 - "High-Level Overview" describes the system to be built, it's different entities, and constraints. 
Section 2 - "Proposed Architecture" describes a proposed architecture for this project and its different layers.
Section 3 - "Key Components with Design pattern considerations" describes the three main components of this project and some considerations for design patterns that may be utilized.

The Goal of this project is to design and implement a thin Experience API that powers a telecom cart on top of a non-persistent Salesforce cart context.

Please keep the entire codebase as small and cohesive as possible. 
Accuracy and clarity should also be important considerations.
All of the code should be in /src except for unit tests which will be housed in /tests. I've proposed a directory structure in Section 2 "Proposed Architecture".
Please include Setup, run, test commands.

Please note these below are suggestions in an attempt to keep things clear and concise - if there further improvements that can be made please bring them up during the Plan mode.

######## Section 1. High-Level Overview
Please design a thin Experience API that exposes a telecom carts operations (e.g., create cart, add items, remove items, calculate totals) backed by a non-persistent Salesforce cart context — meaning that the data lives only in memory - so no database is involved.Use pure functions wherever possible. 

Language: TypeScript on Node 20+. Use any minimal HTTP framework (e.g. Express)

The Salesforce client is mocked/test-doubled with realistic behavior including session time limits.
This API acts as an orchestation layer, transforming frontend operations into mock Salesforce operations, the purpose of which is to abstract awat Salesforce’s complexity.
Write unit tests for the critical paths.


######## Section 2. Proposed Architecture
Lets stick to a layered design to separate concernss:

a. Presentation layer
Handle HTTP requests/responses
E.g. component would be CartController.js (routed via /cart)

b. Application layer
Code for business logic, orchestrate between domain and infrastructure

c. Domain layer
Define cart entities, business rules, and logic

d. Infrastructure layer
Implement external dependencies - Adapters (SalesforceCartClient - the mock SalesForce client, in-memory store)

src/
├── app.ts                     
│
├── routes/
│   └── cart.routes.ts         # defines the endpoints
│
├── controllers/
│   └── CartController.ts      # handles request/response mapping
│
├── services/
│   └── CartService.ts         #  business logic for cart operations, interacts with SalesforceCartClient + CartRepository 
│
├── domain/
│   ├── Cart.ts                # Cart entity (pure logic)
│   ├── CartItem.ts            # cart Item value object
│   └── CartFactory.ts         # Factory for new carts
│
├── infrastructure/
│   ├── CartRepository.ts      # the in-memory store
│   ├── InMemoryCartRepository.ts
│   ├── SalesforceCartClient.ts # Test double for Salesforce
│   └── ExpiryScheduler.ts     # handles cart expiry
│
└── tests/
    ├── CartService.test.ts
    ├── CartRepository.test.ts
    └── SalesforceCartClient.test.ts


######## Section 3. Key Components with Design pattern considerations: 
a. SalesforceCartClient (mock double)
Simulates real Salesforce cart API behavior:
Creates an in-memory temporary cart context with expiry. Implemented using an in-memory Map keyed by contextId.
Allows adding or removing products and returning totals.
Context expires after a timeout (e.g., 5 min). 
Consider the Factory pattern for creating new Carts, and Adapter pattern to create the mock double SalesForceCartAPI

b. Storage - in memory
Stores cart data structures. e.g. const cartStore = new Map<string, Cart>();
Consider Repository Pattern for in-memory storage.

c. Experience API endpoints
Please see spec-b.md in the same folder as this file for these specifications.




