import { CartItem } from './CartItem';
import { InvalidCartItemError } from './errors';

export class Cart {
  constructor(
    readonly id: string,
    readonly contextId: string,
    readonly items: readonly CartItem[],
    readonly createdAt: Date,
    readonly expiresAt: Date
  ) {}

  // Pure function - returns new Cart with added item
  addItem(item: CartItem): Cart {
    // Check if item with same ID already exists
    const existingItem = this.items.find(i => i.id === item.id);
    if (existingItem) {
      throw new InvalidCartItemError(`Item with ID '${item.id}' already exists in cart`);
    }

    return new Cart(
      this.id,
      this.contextId,
      [...this.items, item],
      this.createdAt,
      this.expiresAt
    );
  }

  // Pure function - returns new Cart with removed item
  removeItem(itemId: string): Cart {
    const itemExists = this.items.some(i => i.id === itemId);
    if (!itemExists) {
      throw new InvalidCartItemError(`Item with ID '${itemId}' not found in cart`);
    }

    return new Cart(
      this.id,
      this.contextId,
      this.items.filter(i => i.id !== itemId),
      this.createdAt,
      this.expiresAt
    );
  }

  // Pure function - calculates total
  calculateTotal(): number {
    return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
  }

  // Pure function - checks expiry
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  // Helper to convert to plain object for JSON serialization
  toJSON() {
    return {
      id: this.id,
      contextId: this.contextId,
      items: this.items.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        type: item.type,
        price: item.price,
        quantity: item.quantity,
      })),
      total: this.calculateTotal(),
      createdAt: this.createdAt.toISOString(),
      expiresAt: this.expiresAt.toISOString(),
    };
  }
}
