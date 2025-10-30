"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartFactory = void 0;
const crypto_1 = require("crypto");
const Cart_1 = require("./Cart");
class CartFactory {
    expiryMs;
    constructor(expiryMs) {
        this.expiryMs = expiryMs;
    }
    createCart() {
        const id = (0, crypto_1.randomUUID)();
        const contextId = (0, crypto_1.randomUUID)();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + this.expiryMs);
        return new Cart_1.Cart(id, contextId, [], // empty items array
        now, expiresAt);
    }
}
exports.CartFactory = CartFactory;
//# sourceMappingURL=CartFactory.js.map