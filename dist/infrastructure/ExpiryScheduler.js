"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpiryScheduler = void 0;
class ExpiryScheduler {
    cartRepository;
    salesforceClient;
    timeouts;
    constructor(cartRepository, salesforceClient) {
        this.cartRepository = cartRepository;
        this.salesforceClient = salesforceClient;
        this.timeouts = new Map();
    }
    scheduleExpiry(cartId, contextId, expiryMs) {
        // Cancel existing timeout if any
        this.cancelExpiry(cartId);
        // Schedule new timeout
        const timeout = setTimeout(() => {
            this.expireCart(cartId, contextId);
        }, expiryMs);
        this.timeouts.set(cartId, timeout);
    }
    cancelExpiry(cartId) {
        const timeout = this.timeouts.get(cartId);
        if (timeout) {
            clearTimeout(timeout);
            this.timeouts.delete(cartId);
        }
    }
    expireCart(cartId, contextId) {
        // Remove from repository
        this.cartRepository.delete(cartId);
        // Remove from Salesforce context
        this.salesforceClient.deleteContext(contextId);
        // Clean up timeout reference
        this.timeouts.delete(cartId);
    }
    // Helper for testing - clear all timeouts
    clearAll() {
        for (const timeout of this.timeouts.values()) {
            clearTimeout(timeout);
        }
        this.timeouts.clear();
    }
}
exports.ExpiryScheduler = ExpiryScheduler;
//# sourceMappingURL=ExpiryScheduler.js.map