"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartExpiredError = void 0;
class CartExpiredError extends Error {
    constructor(cartId) {
        super(`Cart with ID '${cartId}' has expired`);
        this.name = 'CartExpiredError';
    }
}
exports.CartExpiredError = CartExpiredError;
//# sourceMappingURL=CartExpiredError.js.map