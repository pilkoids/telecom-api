import { CartFactory } from '../../../src/domain/CartFactory';

describe('CartFactory', () => {
  describe('createCart', () => {
    it('should create a cart with unique IDs', () => {
      const factory = new CartFactory(300000);

      const cart1 = factory.createCart();
      const cart2 = factory.createCart();

      expect(cart1.id).not.toBe(cart2.id);
      expect(cart1.contextId).not.toBe(cart2.contextId);
    });

    it('should create cart with empty items', () => {
      const factory = new CartFactory(300000);
      const cart = factory.createCart();

      expect(cart.items).toEqual([]);
    });

    it('should set expiry time correctly', () => {
      const expiryMs = 300000; // 5 minutes
      const factory = new CartFactory(expiryMs);

      const beforeCreate = Date.now();
      const cart = factory.createCart();
      const afterCreate = Date.now();

      const expectedExpiryMin = beforeCreate + expiryMs;
      const expectedExpiryMax = afterCreate + expiryMs;

      const actualExpiry = cart.expiresAt.getTime();

      expect(actualExpiry).toBeGreaterThanOrEqual(expectedExpiryMin);
      expect(actualExpiry).toBeLessThanOrEqual(expectedExpiryMax);
    });

    it('should set createdAt to current time', () => {
      const factory = new CartFactory(300000);

      const before = Date.now();
      const cart = factory.createCart();
      const after = Date.now();

      const createdAt = cart.createdAt.getTime();

      expect(createdAt).toBeGreaterThanOrEqual(before);
      expect(createdAt).toBeLessThanOrEqual(after);
    });

    it('should respect custom expiry time', () => {
      const customExpiryMs = 60000; // 1 minute
      const factory = new CartFactory(customExpiryMs);

      const cart = factory.createCart();
      const timeDiff = cart.expiresAt.getTime() - cart.createdAt.getTime();

      expect(timeDiff).toBeGreaterThanOrEqual(customExpiryMs - 10);
      expect(timeDiff).toBeLessThanOrEqual(customExpiryMs + 10);
    });
  });
});
