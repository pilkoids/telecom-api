import { MockSalesforceAdapter } from '../../../src/infrastructure/MockSalesforceAdapter';
import { CartItem } from '../../../src/domain/CartItem';

describe('MockSalesforceAdapter', () => {
  let adapter: MockSalesforceAdapter;
  const expiryMs = 1000; // 1 second for testing

  beforeEach(() => {
    adapter = new MockSalesforceAdapter(expiryMs);
  });

  afterEach(() => {
    adapter.clear();
  });

  describe('createCartContext', () => {
    it('should create a new context', () => {
      const contextId = adapter.createCartContext('cart-1');

      expect(contextId).toBe('cart-1');
      expect(adapter.contextExists(contextId)).toBe(true);
    });

    it('should create multiple contexts', () => {
      const context1 = adapter.createCartContext('cart-1');
      const context2 = adapter.createCartContext('cart-2');

      expect(adapter.contextExists(context1)).toBe(true);
      expect(adapter.contextExists(context2)).toBe(true);
    });
  });

  describe('addItemToContext', () => {
    it('should add item to context', () => {
      const contextId = adapter.createCartContext('cart-1');
      const item = new CartItem('item-1', 'prod-1', 'Test Item', 'accessory', 10, 1);

      adapter.addItemToContext(contextId, item);

      const total = adapter.calculateTotal(contextId);
      expect(total).toBe(10);
    });

    it('should throw error when adding duplicate item', () => {
      const contextId = adapter.createCartContext('cart-1');
      const item = new CartItem('item-1', 'prod-1', 'Test Item', 'accessory', 10, 1);

      adapter.addItemToContext(contextId, item);

      expect(() => adapter.addItemToContext(contextId, item)).toThrow('already exists in context');
    });

    it('should throw error for non-existent context', () => {
      const item = new CartItem('item-1', 'prod-1', 'Test Item', 'accessory', 10, 1);

      expect(() => adapter.addItemToContext('non-existent', item)).toThrow('not found');
    });
  });

  describe('removeItemFromContext', () => {
    it('should remove item from context', () => {
      const contextId = adapter.createCartContext('cart-1');
      const item = new CartItem('item-1', 'prod-1', 'Test Item', 'accessory', 10, 1);

      adapter.addItemToContext(contextId, item);
      adapter.removeItemFromContext(contextId, 'item-1');

      const total = adapter.calculateTotal(contextId);
      expect(total).toBe(0);
    });

    it('should throw error when removing non-existent item', () => {
      const contextId = adapter.createCartContext('cart-1');

      expect(() => adapter.removeItemFromContext(contextId, 'item-999')).toThrow('not found in context');
    });

    it('should throw error for non-existent context', () => {
      expect(() => adapter.removeItemFromContext('non-existent', 'item-1')).toThrow('not found');
    });
  });

  describe('calculateTotal', () => {
    it('should return 0 for empty context', () => {
      const contextId = adapter.createCartContext('cart-1');

      const total = adapter.calculateTotal(contextId);

      expect(total).toBe(0);
    });

    it('should calculate total correctly for single item', () => {
      const contextId = adapter.createCartContext('cart-1');
      const item = new CartItem('item-1', 'prod-1', 'Test Item', 'accessory', 10, 3);

      adapter.addItemToContext(contextId, item);

      const total = adapter.calculateTotal(contextId);
      expect(total).toBe(30);
    });

    it('should calculate total correctly for multiple items', () => {
      const contextId = adapter.createCartContext('cart-1');
      const item1 = new CartItem('item-1', 'prod-1', 'Item 1', 'accessory', 10, 2);
      const item2 = new CartItem('item-2', 'prod-2', 'Item 2', 'phone', 100, 1);

      adapter.addItemToContext(contextId, item1);
      adapter.addItemToContext(contextId, item2);

      const total = adapter.calculateTotal(contextId);
      expect(total).toBe(120);
    });

    it('should throw error for non-existent context', () => {
      expect(() => adapter.calculateTotal('non-existent')).toThrow('not found');
    });
  });

  describe('contextExists', () => {
    it('should return true for existing context', () => {
      const contextId = adapter.createCartContext('cart-1');

      expect(adapter.contextExists(contextId)).toBe(true);
    });

    it('should return false for non-existent context', () => {
      expect(adapter.contextExists('non-existent')).toBe(false);
    });

    it('should return false and cleanup for expired context', async () => {
      const shortExpiryAdapter = new MockSalesforceAdapter(50); // 50ms
      const contextId = shortExpiryAdapter.createCartContext('cart-1');

      expect(shortExpiryAdapter.contextExists(contextId)).toBe(true);

      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for expiry

      expect(shortExpiryAdapter.contextExists(contextId)).toBe(false);
    });
  });

  describe('deleteContext', () => {
    it('should delete existing context', () => {
      const contextId = adapter.createCartContext('cart-1');

      adapter.deleteContext(contextId);

      expect(adapter.contextExists(contextId)).toBe(false);
    });

    it('should not throw error when deleting non-existent context', () => {
      expect(() => adapter.deleteContext('non-existent')).not.toThrow();
    });
  });

  describe('expiry behavior', () => {
    it('should throw error when accessing expired context', async () => {
      const shortExpiryAdapter = new MockSalesforceAdapter(50); // 50ms
      const contextId = shortExpiryAdapter.createCartContext('cart-1');

      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for expiry

      expect(() => shortExpiryAdapter.calculateTotal(contextId)).toThrow('expired');
    });
  });
});
