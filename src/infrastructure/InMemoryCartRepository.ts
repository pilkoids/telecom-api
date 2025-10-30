import { Cart } from '../domain/Cart';
import { ICartRepository } from './ICartRepository';

export class InMemoryCartRepository implements ICartRepository {
  private readonly store: Map<string, Cart>;

  constructor() {
    this.store = new Map();
  }

  save(cart: Cart): void {
    this.store.set(cart.id, cart);
  }

  findById(id: string): Cart | null {
    return this.store.get(id) || null;
  }

  delete(id: string): void {
    this.store.delete(id);
  }

  exists(id: string): boolean {
    return this.store.has(id);
  }

  // Helper for testing - get all carts
  getAll(): Cart[] {
    return Array.from(this.store.values());
  }

  // Helper for testing - clear all
  clear(): void {
    this.store.clear();
  }
}
