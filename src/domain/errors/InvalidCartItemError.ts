export class InvalidCartItemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCartItemError';
  }
}
