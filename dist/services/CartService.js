"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const errors_1 = require("../domain/errors");
class CartService {
    cartRepository;
    salesforceClient;
    cartFactory;
    expiryScheduler;
    expiryMs;
    constructor(cartRepository, salesforceClient, cartFactory, expiryScheduler, expiryMs) {
        this.cartRepository = cartRepository;
        this.salesforceClient = salesforceClient;
        this.cartFactory = cartFactory;
        this.expiryScheduler = expiryScheduler;
        this.expiryMs = expiryMs;
    }
    createCart() {
        // Create cart using factory
        const cart = this.cartFactory.createCart();
        // Create Salesforce context
        this.salesforceClient.createCartContext(cart.contextId);
        // Save to repository
        this.cartRepository.save(cart);
        // Schedule expiry
        this.expiryScheduler.scheduleExpiry(cart.id, cart.contextId, this.expiryMs);
        return cart;
    }
    addItem(cartId, item) {
        // Get cart and validate
        const cart = this.getValidCart(cartId);
        // Add to Salesforce context first
        this.salesforceClient.addItemToContext(cart.contextId, item);
        // Add to cart (returns new cart instance)
        const updatedCart = cart.addItem(item);
        // Save updated cart
        this.cartRepository.save(updatedCart);
        return updatedCart;
    }
    removeItem(cartId, itemId) {
        // Get cart and validate
        const cart = this.getValidCart(cartId);
        // Remove from Salesforce context first
        this.salesforceClient.removeItemFromContext(cart.contextId, itemId);
        // Remove from cart (returns new cart instance)
        const updatedCart = cart.removeItem(itemId);
        // Save updated cart
        this.cartRepository.save(updatedCart);
        return updatedCart;
    }
    getCart(cartId) {
        return this.getValidCart(cartId);
    }
    getTotal(cartId) {
        const cart = this.getValidCart(cartId);
        // Verify total matches between domain and Salesforce
        const domainTotal = cart.calculateTotal();
        const salesforceTotal = this.salesforceClient.calculateTotal(cart.contextId);
        // In production, you might want to log if these differ
        if (Math.abs(domainTotal - salesforceTotal) > 0.01) {
            console.warn(`Total mismatch for cart ${cartId}: domain=${domainTotal}, salesforce=${salesforceTotal}`);
        }
        return domainTotal;
    }
    getValidCart(cartId) {
        const cart = this.cartRepository.findById(cartId);
        if (!cart) {
            throw new errors_1.CartNotFoundError(cartId);
        }
        if (cart.isExpired()) {
            // Clean up expired cart
            this.cartRepository.delete(cartId);
            this.salesforceClient.deleteContext(cart.contextId);
            this.expiryScheduler.cancelExpiry(cartId);
            throw new errors_1.CartExpiredError(cartId);
        }
        return cart;
    }
}
exports.CartService = CartService;
//# sourceMappingURL=CartService.js.map