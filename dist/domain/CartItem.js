"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItem = void 0;
const errors_1 = require("./errors");
class CartItem {
    id;
    productId;
    name;
    type;
    price;
    quantity;
    constructor(id, productId, name, type, price, quantity) {
        this.id = id;
        this.productId = productId;
        this.name = name;
        this.type = type;
        this.price = price;
        this.quantity = quantity;
        this.validate();
    }
    validate() {
        if (!this.id || this.id.trim() === '') {
            throw new errors_1.InvalidCartItemError('Item ID is required');
        }
        if (!this.productId || this.productId.trim() === '') {
            throw new errors_1.InvalidCartItemError('Product ID is required');
        }
        if (!this.name || this.name.trim() === '') {
            throw new errors_1.InvalidCartItemError('Item name is required');
        }
        if (!['plan', 'phone', 'accessory'].includes(this.type)) {
            throw new errors_1.InvalidCartItemError(`Invalid item type: ${this.type}`);
        }
        if (this.price < 0) {
            throw new errors_1.InvalidCartItemError('Price cannot be negative');
        }
        if (this.quantity <= 0 || !Number.isInteger(this.quantity)) {
            throw new errors_1.InvalidCartItemError('Quantity must be a positive integer');
        }
    }
    // Value-based equality
    equals(other) {
        return (this.id === other.id &&
            this.productId === other.productId &&
            this.name === other.name &&
            this.type === other.type &&
            this.price === other.price &&
            this.quantity === other.quantity);
    }
    // Helper to get total price for this item
    getTotalPrice() {
        return this.price * this.quantity;
    }
}
exports.CartItem = CartItem;
//# sourceMappingURL=CartItem.js.map