import express, { Express } from 'express';
import { config } from './config';
import { CartFactory } from './domain/CartFactory';
import { InMemoryCartRepository } from './infrastructure/InMemoryCartRepository';
import { MockSalesforceAdapter } from './infrastructure/MockSalesforceAdapter';
import { ExpiryScheduler } from './infrastructure/ExpiryScheduler';
import { CartService } from './services/CartService';
import { CartController } from './controllers/CartController';
import { createCartRoutes } from './routes/cart.routes';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(express.json());

  // Initialize dependencies (Dependency Injection)
  const cartRepository = new InMemoryCartRepository();
  const salesforceClient = new MockSalesforceAdapter(config.cartExpiryMs);
  const expiryScheduler = new ExpiryScheduler(cartRepository, salesforceClient);
  const cartFactory = new CartFactory(config.cartExpiryMs);
  const cartService = new CartService(
    cartRepository,
    salesforceClient,
    cartFactory,
    expiryScheduler,
    config.cartExpiryMs
  );
  const cartController = new CartController(cartService);

  // Routes
  app.use('/', createCartRoutes(cartController));

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  return app;
}
