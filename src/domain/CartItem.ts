import { InvalidCartItemError } from './errors';

export type CartItemType = 'plan' | 'phone' | 'accessory';

export class CartItem {
  constructor(
    readonly id: string,
    readonly productId: string,
    readonly name: string,
    readonly type: CartItemType,
    readonly price: number,
    readonly quantity: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id || this.id.trim() === '') {
      throw new InvalidCartItemError('Item ID is required');
    }
    if (!this.productId || this.productId.trim() === '') {
      throw new InvalidCartItemError('Product ID is required');
    }
    if (!this.name || this.name.trim() === '') {
      throw new InvalidCartItemError('Item name is required');
    }
    if (!['plan', 'phone', 'accessory'].includes(this.type)) {
      throw new InvalidCartItemError(`Invalid item type: ${this.type}`);
    }
    if (this.price < 0) {
      throw new InvalidCartItemError('Price cannot be negative');
    }
    if (this.quantity <= 0 || !Number.isInteger(this.quantity)) {
      throw new InvalidCartItemError('Quantity must be a positive integer');
    }
  }

  // Value-based equality
  equals(other: CartItem): boolean {
    return (
      this.id === other.id &&
      this.productId === other.productId &&
      this.name === other.name &&
      this.type === other.type &&
      this.price === other.price &&
      this.quantity === other.quantity
    );
  }

  // Helper to get total price for this item
  getTotalPrice(): number {
    return this.price * this.quantity;
  }
}
