"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCartItemError = void 0;
class InvalidCartItemError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidCartItemError';
    }
}
exports.InvalidCartItemError = InvalidCartItemError;
//# sourceMappingURL=InvalidCartItemError.js.map