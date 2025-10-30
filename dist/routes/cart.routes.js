"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCartRoutes = createCartRoutes;
const express_1 = require("express");
function createCartRoutes(cartController) {
    const router = (0, express_1.Router)();
    // POST /cart - Create a new cart
    router.post('/cart', cartController.createCart);
    // POST /cart/:id/item - Add item to cart
    router.post('/cart/:id/item', cartController.addItem);
    // DELETE /cart/:id/item - Remove item from cart
    router.delete('/cart/:id/item', cartController.removeItem);
    // GET /cart/:id - Get cart by ID
    router.get('/cart/:id', cartController.getCart);
    // GET /cart/:id/total - Get cart total
    router.get('/cart/:id/total', cartController.getTotal);
    return router;
}
//# sourceMappingURL=cart.routes.js.map