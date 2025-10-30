import { Cart } from '../domain/Cart';
import { CartItem } from '../domain/CartItem';
import { CartFactory } from '../domain/CartFactory';
import { CartNotFoundError, CartExpiredError } from '../domain/errors';
import { ICartRepository } from '../infrastructure/ICartRepository';
import { ISalesforceCartClient } from '../infrastructure/ISalesforceCartClient';
import { ExpiryScheduler } from '../infrastructure/ExpiryScheduler';

export class CartService {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly salesforceClient: ISalesforceCartClient,
    private readonly cartFactory: CartFactory,
    private readonly expiryScheduler: ExpiryScheduler,
    private readonly expiryMs: number
  ) {}

  createCart(): Cart {
    // Create cart using factory
    const cart = this.cartFactory.createCart();

    // Create Salesforce context
    this.salesforceClient.createCartContext(cart.contextId);

    // Save to repository
    this.cartRepository.save(cart);

    // Schedule expiry
    this.expiryScheduler.scheduleExpiry(cart.id, cart.contextId, this.expiryMs);

    return cart;
  }

  addItem(cartId: string, item: CartItem): Cart {
    // Get cart and validate
    const cart = this.getValidCart(cartId);

    // Add to Salesforce context first
    this.salesforceClient.addItemToContext(cart.contextId, item);

    // Add to cart (returns new cart instance)
    const updatedCart = cart.addItem(item);

    // Save updated cart
    this.cartRepository.save(updatedCart);

    return updatedCart;
  }

  removeItem(cartId: string, itemId: string): Cart {
    // Get cart and validate
    const cart = this.getValidCart(cartId);

    // Remove from Salesforce context first
    this.salesforceClient.removeItemFromContext(cart.contextId, itemId);

    // Remove from cart (returns new cart instance)
    const updatedCart = cart.removeItem(itemId);

    // Save updated cart
    this.cartRepository.save(updatedCart);

    return updatedCart;
  }

  getCart(cartId: string): Cart {
    return this.getValidCart(cartId);
  }

  getTotal(cartId: string): number {
    const cart = this.getValidCart(cartId);

    // Verify total matches between domain and Salesforce
    const domainTotal = cart.calculateTotal();
    const salesforceTotal = this.salesforceClient.calculateTotal(cart.contextId);

    // In production, you might want to log if these differ
    if (Math.abs(domainTotal - salesforceTotal) > 0.01) {
      console.warn(
        `Total mismatch for cart ${cartId}: domain=${domainTotal}, salesforce=${salesforceTotal}`
      );
    }

    return domainTotal;
  }

  private getValidCart(cartId: string): Cart {
    const cart = this.cartRepository.findById(cartId);

    if (!cart) {
      throw new CartNotFoundError(cartId);
    }

    if (cart.isExpired()) {
      // Clean up expired cart
      this.cartRepository.delete(cartId);
      this.salesforceClient.deleteContext(cart.contextId);
      this.expiryScheduler.cancelExpiry(cartId);
      throw new CartExpiredError(cartId);
    }

    return cart;
  }
}
