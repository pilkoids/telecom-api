import { randomUUID } from 'crypto';
import { Cart } from './Cart';

export class CartFactory {
  constructor(private readonly expiryMs: number) {}

  createCart(): Cart {
    const id = randomUUID();
    const contextId = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.expiryMs);

    return new Cart(
      id,
      contextId,
      [], // empty items array
      now,
      expiresAt
    );
  }
}
