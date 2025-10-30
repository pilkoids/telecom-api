import { Router } from 'express';
import { CartController } from '../controllers/CartController';

export function createCartRoutes(cartController: CartController): Router {
  const router = Router();

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
