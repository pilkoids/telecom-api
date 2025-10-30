"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const CartFactory_1 = require("./domain/CartFactory");
const InMemoryCartRepository_1 = require("./infrastructure/InMemoryCartRepository");
const MockSalesforceAdapter_1 = require("./infrastructure/MockSalesforceAdapter");
const ExpiryScheduler_1 = require("./infrastructure/ExpiryScheduler");
const CartService_1 = require("./services/CartService");
const CartController_1 = require("./controllers/CartController");
const cart_routes_1 = require("./routes/cart.routes");
function createApp() {
    const app = (0, express_1.default)();
    // Middleware
    app.use(express_1.default.json());
    // Initialize dependencies (Dependency Injection)
    const cartRepository = new InMemoryCartRepository_1.InMemoryCartRepository();
    const salesforceClient = new MockSalesforceAdapter_1.MockSalesforceAdapter(config_1.config.cartExpiryMs);
    const expiryScheduler = new ExpiryScheduler_1.ExpiryScheduler(cartRepository, salesforceClient);
    const cartFactory = new CartFactory_1.CartFactory(config_1.config.cartExpiryMs);
    const cartService = new CartService_1.CartService(cartRepository, salesforceClient, cartFactory, expiryScheduler, config_1.config.cartExpiryMs);
    const cartController = new CartController_1.CartController(cartService);
    // Routes
    app.use('/', (0, cart_routes_1.createCartRoutes)(cartController));
    // Health check endpoint
    app.get('/health', (_req, res) => {
        res.status(200).json({ status: 'ok' });
    });
    return app;
}
//# sourceMappingURL=app.js.map