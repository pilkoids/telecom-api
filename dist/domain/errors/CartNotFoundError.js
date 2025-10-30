"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartNotFoundError = void 0;
class CartNotFoundError extends Error {
    constructor(cartId) {
        super(`Cart with ID '${cartId}' not found`);
        this.name = 'CartNotFoundError';
    }
}
exports.CartNotFoundError = CartNotFoundError;
//# sourceMappingURL=CartNotFoundError.js.map