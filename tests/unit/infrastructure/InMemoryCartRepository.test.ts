import { InMemoryCartRepository } from '../../../src/infrastructure/InMemoryCartRepository';
import { Cart } from '../../../src/domain/Cart';

describe('InMemoryCartRepository', () => {
  let repository: InMemoryCartRepository;

  beforeEach(() => {
    repository = new InMemoryCartRepository();
  });

  describe('save', () => {
    it('should save a cart', () => {
      const cart = new Cart('cart-1', 'context-1', [], new Date(), new Date());

      repository.save(cart);

      expect(repository.exists('cart-1')).toBe(true);
    });

    it('should overwrite existing cart with same ID', () => {
      const cart1 = new Cart('cart-1', 'context-1', [], new Date(), new Date());
      const cart2 = new Cart('cart-1', 'context-2', [], new Date(), new Date());

      repository.save(cart1);
      repository.save(cart2);

      const retrieved = repository.findById('cart-1');
      expect(retrieved?.contextId).toBe('context-2');
    });
  });

  describe('findById', () => {
    it('should return cart if exists', () => {
      const cart = new Cart('cart-1', 'context-1', [], new Date(), new Date());
      repository.save(cart);

      const retrieved = repository.findById('cart-1');

      expect(retrieved).toBe(cart);
    });

    it('should return null if cart does not exist', () => {
      const retrieved = repository.findById('non-existent');

      expect(retrieved).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete existing cart', () => {
      const cart = new Cart('cart-1', 'context-1', [], new Date(), new Date());
      repository.save(cart);

      repository.delete('cart-1');

      expect(repository.exists('cart-1')).toBe(false);
    });

    it('should not throw error when deleting non-existent cart', () => {
      expect(() => repository.delete('non-existent')).not.toThrow();
    });
  });

  describe('exists', () => {
    it('should return true for existing cart', () => {
      const cart = new Cart('cart-1', 'context-1', [], new Date(), new Date());
      repository.save(cart);

      expect(repository.exists('cart-1')).toBe(true);
    });

    it('should return false for non-existent cart', () => {
      expect(repository.exists('non-existent')).toBe(false);
    });
  });

  describe('getAll', () => {
    it('should return empty array for empty repository', () => {
      expect(repository.getAll()).toEqual([]);
    });

    it('should return all carts', () => {
      const cart1 = new Cart('cart-1', 'context-1', [], new Date(), new Date());
      const cart2 = new Cart('cart-2', 'context-2', [], new Date(), new Date());

      repository.save(cart1);
      repository.save(cart2);

      const carts = repository.getAll();

      expect(carts).toHaveLength(2);
      expect(carts).toContain(cart1);
      expect(carts).toContain(cart2);
    });
  });

  describe('clear', () => {
    it('should remove all carts', () => {
      const cart1 = new Cart('cart-1', 'context-1', [], new Date(), new Date());
      const cart2 = new Cart('cart-2', 'context-2', [], new Date(), new Date());

      repository.save(cart1);
      repository.save(cart2);

      repository.clear();

      expect(repository.getAll()).toEqual([]);
    });
  });
});
