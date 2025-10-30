export class CartExpiredError extends Error {
  constructor(cartId: string) {
    super(`Cart with ID '${cartId}' has expired`);
    this.name = 'CartExpiredError';
  }
}
