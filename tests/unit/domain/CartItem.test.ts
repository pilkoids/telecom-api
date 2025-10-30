import { CartItem } from '../../../src/domain/CartItem';
import { InvalidCartItemError } from '../../../src/domain/errors';

describe('CartItem', () => {
  describe('constructor', () => {
    it('should create a valid cart item', () => {
      const item = new CartItem('item-1', 'prod-1', 'iPhone 15', 'phone', 999.99, 1);

      expect(item.id).toBe('item-1');
      expect(item.productId).toBe('prod-1');
      expect(item.name).toBe('iPhone 15');
      expect(item.type).toBe('phone');
      expect(item.price).toBe(999.99);
      expect(item.quantity).toBe(1);
    });

    it('should throw error for empty id', () => {
      expect(() => {
        new CartItem('', 'prod-1', 'iPhone 15', 'phone', 999.99, 1);
      }).toThrow(InvalidCartItemError);
    });

    it('should throw error for empty productId', () => {
      expect(() => {
        new CartItem('item-1', '', 'iPhone 15', 'phone', 999.99, 1);
      }).toThrow(InvalidCartItemError);
    });

    it('should throw error for empty name', () => {
      expect(() => {
        new CartItem('item-1', 'prod-1', '', 'phone', 999.99, 1);
      }).toThrow(InvalidCartItemError);
    });

    it('should throw error for invalid type', () => {
      expect(() => {
        new CartItem('item-1', 'prod-1', 'iPhone 15', 'invalid' as any, 999.99, 1);
      }).toThrow(InvalidCartItemError);
    });

    it('should throw error for negative price', () => {
      expect(() => {
        new CartItem('item-1', 'prod-1', 'iPhone 15', 'phone', -10, 1);
      }).toThrow(InvalidCartItemError);
    });

    it('should throw error for zero quantity', () => {
      expect(() => {
        new CartItem('item-1', 'prod-1', 'iPhone 15', 'phone', 999.99, 0);
      }).toThrow(InvalidCartItemError);
    });

    it('should throw error for negative quantity', () => {
      expect(() => {
        new CartItem('item-1', 'prod-1', 'iPhone 15', 'phone', 999.99, -1);
      }).toThrow(InvalidCartItemError);
    });

    it('should throw error for non-integer quantity', () => {
      expect(() => {
        new CartItem('item-1', 'prod-1', 'iPhone 15', 'phone', 999.99, 1.5);
      }).toThrow(InvalidCartItemError);
    });
  });

  describe('getTotalPrice', () => {
    it('should calculate total price correctly', () => {
      const item = new CartItem('item-1', 'prod-1', 'Case', 'accessory', 19.99, 3);
      expect(item.getTotalPrice()).toBe(59.97);
    });

    it('should handle quantity of 1', () => {
      const item = new CartItem('item-1', 'prod-1', 'iPhone 15', 'phone', 999.99, 1);
      expect(item.getTotalPrice()).toBe(999.99);
    });
  });

  describe('equals', () => {
    it('should return true for identical items', () => {
      const item1 = new CartItem('item-1', 'prod-1', 'iPhone 15', 'phone', 999.99, 1);
      const item2 = new CartItem('item-1', 'prod-1', 'iPhone 15', 'phone', 999.99, 1);

      expect(item1.equals(item2)).toBe(true);
    });

    it('should return false for different items', () => {
      const item1 = new CartItem('item-1', 'prod-1', 'iPhone 15', 'phone', 999.99, 1);
      const item2 = new CartItem('item-2', 'prod-1', 'iPhone 15', 'phone', 999.99, 1);

      expect(item1.equals(item2)).toBe(false);
    });
  });
});
