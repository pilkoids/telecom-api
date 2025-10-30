import { CartService } from '../../../src/services/CartService';
import { CartFactory } from '../../../src/domain/CartFactory';
import { InMemoryCartRepository } from '../../../src/infrastructure/InMemoryCartRepository';
import { MockSalesforceAdapter } from '../../../src/infrastructure/MockSalesforceAdapter';
import { ExpiryScheduler } from '../../../src/infrastructure/ExpiryScheduler';
import { CartItem } from '../../../src/domain/CartItem';
import { CartNotFoundError } from '../../../src/domain/errors';

describe('CartService', () => {
  let cartService: CartService;
  let cartRepository: InMemoryCartRepository;
  let salesforceClient: MockSalesforceAdapter;
  let expiryScheduler: ExpiryScheduler;
  let cartFactory: CartFactory;
  const expiryMs = 300000;

  beforeEach(() => {
    cartRepository = new InMemoryCartRepository();
    salesforceClient = new MockSalesforceAdapter(expiryMs);
    expiryScheduler = new ExpiryScheduler(cartRepository, salesforceClient);
    cartFactory = new CartFactory(expiryMs);
    cartService = new CartService(
      cartRepository,
      salesforceClient,
      cartFactory,
      expiryScheduler,
      expiryMs
    );
  });

  afterEach(() => {
    expiryScheduler.clearAll();
    cartRepository.clear();
    salesforceClient.clear();
  });

  describe('createCart', () => {
    it('should create a new cart', () => {
      const cart = cartService.createCart();

      expect(cart.id).toBeDefined();
      expect(cart.contextId).toBeDefined();
      expect(cart.items).toEqual([]);
      expect(cartRepository.exists(cart.id)).toBe(true);
      expect(salesforceClient.contextExists(cart.contextId)).toBe(true);
    });

    it('should create multiple carts with unique IDs', () => {
      const cart1 = cartService.createCart();
      const cart2 = cartService.createCart();

      expect(cart1.id).not.toBe(cart2.id);
      expect(cart1.contextId).not.toBe(cart2.contextId);
    });
  });

  describe('addItem', () => {
    it('should add item to cart', () => {
      const cart = cartService.createCart();
      const item = new CartItem('item-1', 'prod-1', 'Test Item', 'accessory', 10, 1);

      const updatedCart = cartService.addItem(cart.id, item);

      expect(updatedCart.items).toHaveLength(1);
      expect(updatedCart.items[0]).toEqual(item);
    });

    it('should sync with Salesforce context', () => {
      const cart = cartService.createCart();
      const item = new CartItem('item-1', 'prod-1', 'Test Item', 'accessory', 10, 1);

      cartService.addItem(cart.id, item);

      const total = salesforceClient.calculateTotal(cart.contextId);
      expect(total).toBe(10);
    });

    it('should throw CartNotFoundError for non-existent cart', () => {
      const item = new CartItem('item-1', 'prod-1', 'Test Item', 'accessory', 10, 1);

      expect(() => cartService.addItem('non-existent', item)).toThrow(CartNotFoundError);
    });

    it('should throw error for expired cart (scheduler cleanup)', async () => {
      const shortExpiryMs = 50;
      const shortExpiryFactory = new CartFactory(shortExpiryMs);
      const shortExpiryClient = new MockSalesforceAdapter(shortExpiryMs);
      const shortExpiryScheduler = new ExpiryScheduler(cartRepository, shortExpiryClient);
      const shortExpiryService = new CartService(
        cartRepository,
        shortExpiryClient,
        shortExpiryFactory,
        shortExpiryScheduler,
        shortExpiryMs
      );

      const cart = shortExpiryService.createCart();
      const item = new CartItem('item-1', 'prod-1', 'Test Item', 'accessory', 10, 1);

      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for expiry and scheduler cleanup

      // After scheduler cleanup, cart is deleted from repository
      expect(() => shortExpiryService.addItem(cart.id, item)).toThrow(CartNotFoundError);

      shortExpiryScheduler.clearAll();
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const cart = cartService.createCart();
      const item = new CartItem('item-1', 'prod-1', 'Test Item', 'accessory', 10, 1);

      cartService.addItem(cart.id, item);
      const updatedCart = cartService.removeItem(cart.id, 'item-1');

      expect(updatedCart.items).toHaveLength(0);
    });

    it('should sync with Salesforce context', () => {
      const cart = cartService.createCart();
      const item = new CartItem('item-1', 'prod-1', 'Test Item', 'accessory', 10, 1);

      cartService.addItem(cart.id, item);
      cartService.removeItem(cart.id, 'item-1');

      const total = salesforceClient.calculateTotal(cart.contextId);
      expect(total).toBe(0);
    });

    it('should throw CartNotFoundError for non-existent cart', () => {
      expect(() => cartService.removeItem('non-existent', 'item-1')).toThrow(CartNotFoundError);
    });
  });

  describe('getCart', () => {
    it('should retrieve existing cart', () => {
      const cart = cartService.createCart();

      const retrieved = cartService.getCart(cart.id);

      expect(retrieved.id).toBe(cart.id);
    });

    it('should throw CartNotFoundError for non-existent cart', () => {
      expect(() => cartService.getCart('non-existent')).toThrow(CartNotFoundError);
    });

    it('should throw error for expired cart (scheduler cleanup)', async () => {
      const shortExpiryMs = 50;
      const shortExpiryFactory = new CartFactory(shortExpiryMs);
      const shortExpiryClient = new MockSalesforceAdapter(shortExpiryMs);
      const shortExpiryScheduler = new ExpiryScheduler(cartRepository, shortExpiryClient);
      const shortExpiryService = new CartService(
        cartRepository,
        shortExpiryClient,
        shortExpiryFactory,
        shortExpiryScheduler,
        shortExpiryMs
      );

      const cart = shortExpiryService.createCart();

      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for expiry and scheduler cleanup

      // After scheduler cleanup, cart is deleted from repository
      expect(() => shortExpiryService.getCart(cart.id)).toThrow(CartNotFoundError);

      shortExpiryScheduler.clearAll();
    });
  });

  describe('getTotal', () => {
    it('should calculate total for cart', () => {
      const cart = cartService.createCart();
      const item1 = new CartItem('item-1', 'prod-1', 'Item 1', 'accessory', 10, 2);
      const item2 = new CartItem('item-2', 'prod-2', 'Item 2', 'phone', 100, 1);

      cartService.addItem(cart.id, item1);
      cartService.addItem(cart.id, item2);

      const total = cartService.getTotal(cart.id);

      expect(total).toBe(120);
    });

    it('should return 0 for empty cart', () => {
      const cart = cartService.createCart();

      const total = cartService.getTotal(cart.id);

      expect(total).toBe(0);
    });

    it('should throw CartNotFoundError for non-existent cart', () => {
      expect(() => cartService.getTotal('non-existent')).toThrow(CartNotFoundError);
    });
  });
});
