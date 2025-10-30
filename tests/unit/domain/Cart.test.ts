import { Cart } from '../../../src/domain/Cart';
import { CartItem } from '../../../src/domain/CartItem';
import { InvalidCartItemError } from '../../../src/domain/errors';

describe('Cart', () => {
  const createTestItem = (id: string, price: number, quantity: number): CartItem => {
    return new CartItem(id, `prod-${id}`, `Item ${id}`, 'accessory', price, quantity);
  };

  describe('addItem', () => {
    it('should add item to empty cart', () => {
      const cart = new Cart('cart-1', 'context-1', [], new Date(), new Date());
      const item = createTestItem('item-1', 10, 1);

      const updatedCart = cart.addItem(item);

      expect(updatedCart.items.length).toBe(1);
      expect(updatedCart.items[0]).toBe(item);
      expect(updatedCart.id).toBe(cart.id); // Same ID
    });

    it('should add multiple items', () => {
      const cart = new Cart('cart-1', 'context-1', [], new Date(), new Date());
      const item1 = createTestItem('item-1', 10, 1);
      const item2 = createTestItem('item-2', 20, 1);

      const cart2 = cart.addItem(item1);
      const cart3 = cart2.addItem(item2);

      expect(cart3.items.length).toBe(2);
      expect(cart3.items[0]).toBe(item1);
      expect(cart3.items[1]).toBe(item2);
    });

    it('should throw error when adding item with duplicate ID', () => {
      const item1 = createTestItem('item-1', 10, 1);
      const cart = new Cart('cart-1', 'context-1', [item1], new Date(), new Date());

      const duplicateItem = createTestItem('item-1', 20, 2);

      expect(() => cart.addItem(duplicateItem)).toThrow(InvalidCartItemError);
      expect(() => cart.addItem(duplicateItem)).toThrow("Item with ID 'item-1' already exists in cart");
    });

    it('should not mutate original cart', () => {
      const cart = new Cart('cart-1', 'context-1', [], new Date(), new Date());
      const item = createTestItem('item-1', 10, 1);

      cart.addItem(item);

      expect(cart.items.length).toBe(0); // Original unchanged
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const item1 = createTestItem('item-1', 10, 1);
      const item2 = createTestItem('item-2', 20, 1);
      const cart = new Cart('cart-1', 'context-1', [item1, item2], new Date(), new Date());

      const updatedCart = cart.removeItem('item-1');

      expect(updatedCart.items.length).toBe(1);
      expect(updatedCart.items[0]).toBe(item2);
    });

    it('should throw error when removing non-existent item', () => {
      const cart = new Cart('cart-1', 'context-1', [], new Date(), new Date());

      expect(() => cart.removeItem('item-999')).toThrow(InvalidCartItemError);
      expect(() => cart.removeItem('item-999')).toThrow("Item with ID 'item-999' not found in cart");
    });

    it('should not mutate original cart', () => {
      const item1 = createTestItem('item-1', 10, 1);
      const cart = new Cart('cart-1', 'context-1', [item1], new Date(), new Date());

      cart.removeItem('item-1');

      expect(cart.items.length).toBe(1); // Original unchanged
    });
  });

  describe('calculateTotal', () => {
    it('should return 0 for empty cart', () => {
      const cart = new Cart('cart-1', 'context-1', [], new Date(), new Date());
      expect(cart.calculateTotal()).toBe(0);
    });

    it('should calculate total for single item', () => {
      const item = createTestItem('item-1', 10, 3);
      const cart = new Cart('cart-1', 'context-1', [item], new Date(), new Date());

      expect(cart.calculateTotal()).toBe(30);
    });

    it('should calculate total for multiple items', () => {
      const item1 = createTestItem('item-1', 10, 2); // 20
      const item2 = createTestItem('item-2', 15, 3); // 45
      const cart = new Cart('cart-1', 'context-1', [item1, item2], new Date(), new Date());

      expect(cart.calculateTotal()).toBe(65);
    });
  });

  describe('isExpired', () => {
    it('should return false for non-expired cart', () => {
      const future = new Date(Date.now() + 10000);
      const cart = new Cart('cart-1', 'context-1', [], new Date(), future);

      expect(cart.isExpired()).toBe(false);
    });

    it('should return true for expired cart', () => {
      const past = new Date(Date.now() - 1000);
      const cart = new Cart('cart-1', 'context-1', [], new Date(), past);

      expect(cart.isExpired()).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('should serialize cart correctly', () => {
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const expiresAt = new Date('2024-01-01T00:05:00Z');
      const item = createTestItem('item-1', 10, 2);
      const cart = new Cart('cart-1', 'context-1', [item], createdAt, expiresAt);

      const json = cart.toJSON();

      expect(json).toEqual({
        id: 'cart-1',
        contextId: 'context-1',
        items: [{
          id: 'item-1',
          productId: 'prod-item-1',
          name: 'Item item-1',
          type: 'accessory',
          price: 10,
          quantity: 2,
        }],
        total: 20,
        createdAt: '2024-01-01T00:00:00.000Z',
        expiresAt: '2024-01-01T00:05:00.000Z',
      });
    });
  });
});
