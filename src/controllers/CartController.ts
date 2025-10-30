import { Request, Response } from 'express';
import { CartService } from '../services/CartService';
import { CartItem } from '../domain/CartItem';
import { CartNotFoundError, CartExpiredError, InvalidCartItemError } from '../domain/errors';
import { SalesforceContextError } from '../infrastructure/MockSalesforceAdapter';

export class CartController {
  constructor(private readonly cartService: CartService) {}

  createCart = async (_req: Request, res: Response): Promise<void> => {
    try {
      const cart = this.cartService.createCart();
      res.status(201).json(cart.toJSON());
    } catch (error) {
      this.handleError(res, error);
    }
  };

  addItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const cartId = req.params.id;
      const { id, productId, name, type, price, quantity } = req.body;

      // Validate required fields
      if (!id || !productId || !name || !type || price === undefined || !quantity) {
        res.status(400).json({ error: 'Missing required fields: id, productId, name, type, price, quantity' });
        return;
      }

      const item = new CartItem(id, productId, name, type, price, quantity);
      const cart = this.cartService.addItem(cartId, item);

      res.status(200).json(cart.toJSON());
    } catch (error) {
      this.handleError(res, error);
    }
  };

  removeItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const cartId = req.params.id;
      const { itemId } = req.body;

      if (!itemId) {
        res.status(400).json({ error: 'Missing required field: itemId' });
        return;
      }

      const cart = this.cartService.removeItem(cartId, itemId);

      res.status(200).json(cart.toJSON());
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const cartId = req.params.id;
      const cart = this.cartService.getCart(cartId);

      res.status(200).json(cart.toJSON());
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getTotal = async (req: Request, res: Response): Promise<void> => {
    try {
      const cartId = req.params.id;
      const total = this.cartService.getTotal(cartId);

      res.status(200).json({ cartId, total });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  private handleError(res: Response, error: unknown): void {
    if (error instanceof CartNotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof CartExpiredError) {
      res.status(410).json({ error: error.message });
    } else if (error instanceof InvalidCartItemError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof SalesforceContextError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof Error) {
      res.status(500).json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
