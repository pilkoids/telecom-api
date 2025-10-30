"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockSalesforceAdapter = exports.SalesforceContextError = void 0;
class SalesforceContextError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SalesforceContextError';
    }
}
exports.SalesforceContextError = SalesforceContextError;
class MockSalesforceAdapter {
    contexts;
    expiryMs;
    constructor(expiryMs) {
        this.contexts = new Map();
        this.expiryMs = expiryMs;
    }
    createCartContext(cartId) {
        const contextId = cartId; // Using cartId as contextId for simplicity
        const now = new Date();
        const expiresAt = new Date(now.getTime() + this.expiryMs);
        this.contexts.set(contextId, {
            cartId,
            items: new Map(),
            createdAt: now,
            expiresAt,
        });
        return contextId;
    }
    addItemToContext(contextId, item) {
        const context = this.getValidContext(contextId);
        if (context.items.has(item.id)) {
            throw new SalesforceContextError(`Item with ID '${item.id}' already exists in context`);
        }
        context.items.set(item.id, item);
    }
    removeItemFromContext(contextId, itemId) {
        const context = this.getValidContext(contextId);
        if (!context.items.has(itemId)) {
            throw new SalesforceContextError(`Item with ID '${itemId}' not found in context`);
        }
        context.items.delete(itemId);
    }
    calculateTotal(contextId) {
        const context = this.getValidContext(contextId);
        let total = 0;
        for (const item of context.items.values()) {
            total += item.getTotalPrice();
        }
        return total;
    }
    contextExists(contextId) {
        const context = this.contexts.get(contextId);
        if (!context) {
            return false;
        }
        // Check if expired
        if (new Date() > context.expiresAt) {
            this.contexts.delete(contextId);
            return false;
        }
        return true;
    }
    deleteContext(contextId) {
        this.contexts.delete(contextId);
    }
    getValidContext(contextId) {
        const context = this.contexts.get(contextId);
        if (!context) {
            throw new SalesforceContextError(`Context '${contextId}' not found`);
        }
        // Check if expired
        if (new Date() > context.expiresAt) {
            this.contexts.delete(contextId);
            throw new SalesforceContextError(`Context '${contextId}' has expired`);
        }
        return context;
    }
    // Helper for testing
    getAllContexts() {
        return Array.from(this.contexts.values());
    }
    // Helper for testing
    clear() {
        this.contexts.clear();
    }
}
exports.MockSalesforceAdapter = MockSalesforceAdapter;
//# sourceMappingURL=MockSalesforceAdapter.js.map