export class CartNotFoundError extends Error {
  constructor(cartId: string) {
    super(`Cart with ID '${cartId}' not found`);
    this.name = 'CartNotFoundError';
  }
}
