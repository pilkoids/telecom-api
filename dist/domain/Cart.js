"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const errors_1 = require("./errors");
class Cart {
    id;
    contextId;
    items;
    createdAt;
    expiresAt;
    constructor(id, contextId, items, createdAt, expiresAt) {
        this.id = id;
        this.contextId = contextId;
        this.items = items;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }
    // Pure function - returns new Cart with added item
    addItem(item) {
        // Check if item with same ID already exists
        const existingItem = this.items.find(i => i.id === item.id);
        if (existingItem) {
            throw new errors_1.InvalidCartItemError(`Item with ID '${item.id}' already exists in cart`);
        }
        return new Cart(this.id, this.contextId, [...this.items, item], this.createdAt, this.expiresAt);
    }
    // Pure function - returns new Cart with removed item
    removeItem(itemId) {
        const itemExists = this.items.some(i => i.id === itemId);
        if (!itemExists) {
            throw new errors_1.InvalidCartItemError(`Item with ID '${itemId}' not found in cart`);
        }
        return new Cart(this.id, this.contextId, this.items.filter(i => i.id !== itemId), this.createdAt, this.expiresAt);
    }
    // Pure function - calculates total
    calculateTotal() {
        return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
    }
    // Pure function - checks expiry
    isExpired() {
        return new Date() > this.expiresAt;
    }
    // Helper to convert to plain object for JSON serialization
    toJSON() {
        return {
            id: this.id,
            contextId: this.contextId,
            items: this.items.map(item => ({
                id: item.id,
                productId: item.productId,
                name: item.name,
                type: item.type,
                price: item.price,
                quantity: item.quantity,
            })),
            total: this.calculateTotal(),
            createdAt: this.createdAt.toISOString(),
            expiresAt: this.expiresAt.toISOString(),
        };
    }
}
exports.Cart = Cart;
//# sourceMappingURL=Cart.js.map