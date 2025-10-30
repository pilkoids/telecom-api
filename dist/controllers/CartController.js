"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const CartItem_1 = require("../domain/CartItem");
const errors_1 = require("../domain/errors");
const MockSalesforceAdapter_1 = require("../infrastructure/MockSalesforceAdapter");
class CartController {
    cartService;
    constructor(cartService) {
        this.cartService = cartService;
    }
    createCart = async (_req, res) => {
        try {
            const cart = this.cartService.createCart();
            res.status(201).json(cart.toJSON());
        }
        catch (error) {
            this.handleError(res, error);
        }
    };
    addItem = async (req, res) => {
        try {
            const cartId = req.params.id;
            const { id, productId, name, type, price, quantity } = req.body;
            // Validate required fields
            if (!id || !productId || !name || !type || price === undefined || !quantity) {
                res.status(400).json({ error: 'Missing required fields: id, productId, name, type, price, quantity' });
                return;
            }
            const item = new CartItem_1.CartItem(id, productId, name, type, price, quantity);
            const cart = this.cartService.addItem(cartId, item);
            res.status(200).json(cart.toJSON());
        }
        catch (error) {
            this.handleError(res, error);
        }
    };
    removeItem = async (req, res) => {
        try {
            const cartId = req.params.id;
            const { itemId } = req.body;
            if (!itemId) {
                res.status(400).json({ error: 'Missing required field: itemId' });
                return;
            }
            const cart = this.cartService.removeItem(cartId, itemId);
            res.status(200).json(cart.toJSON());
        }
        catch (error) {
            this.handleError(res, error);
        }
    };
    getCart = async (req, res) => {
        try {
            const cartId = req.params.id;
            const cart = this.cartService.getCart(cartId);
            res.status(200).json(cart.toJSON());
        }
        catch (error) {
            this.handleError(res, error);
        }
    };
    getTotal = async (req, res) => {
        try {
            const cartId = req.params.id;
            const total = this.cartService.getTotal(cartId);
            res.status(200).json({ cartId, total });
        }
        catch (error) {
            this.handleError(res, error);
        }
    };
    handleError(res, error) {
        if (error instanceof errors_1.CartNotFoundError) {
            res.status(404).json({ error: error.message });
        }
        else if (error instanceof errors_1.CartExpiredError) {
            res.status(410).json({ error: error.message });
        }
        else if (error instanceof errors_1.InvalidCartItemError) {
            res.status(400).json({ error: error.message });
        }
        else if (error instanceof MockSalesforceAdapter_1.SalesforceContextError) {
            res.status(400).json({ error: error.message });
        }
        else if (error instanceof Error) {
            res.status(500).json({ error: 'Internal server error', message: error.message });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.CartController = CartController;
//# sourceMappingURL=CartController.js.map