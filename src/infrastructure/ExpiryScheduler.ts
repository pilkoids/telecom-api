import { ICartRepository } from './ICartRepository';
import { ISalesforceCartClient } from './ISalesforceCartClient';

export class ExpiryScheduler {
  private readonly timeouts: Map<string, NodeJS.Timeout>;

  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly salesforceClient: ISalesforceCartClient
  ) {
    this.timeouts = new Map();
  }

  scheduleExpiry(cartId: string, contextId: string, expiryMs: number): void {
    // Cancel existing timeout if any
    this.cancelExpiry(cartId);

    // Schedule new timeout
    const timeout = setTimeout(() => {
      this.expireCart(cartId, contextId);
    }, expiryMs);

    this.timeouts.set(cartId, timeout);
  }

  cancelExpiry(cartId: string): void {
    const timeout = this.timeouts.get(cartId);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(cartId);
    }
  }

  private expireCart(cartId: string, contextId: string): void {
    // Remove from repository
    this.cartRepository.delete(cartId);

    // Remove from Salesforce context
    this.salesforceClient.deleteContext(contextId);

    // Clean up timeout reference
    this.timeouts.delete(cartId);
  }

  // Helper for testing - clear all timeouts
  clearAll(): void {
    for (const timeout of this.timeouts.values()) {
      clearTimeout(timeout);
    }
    this.timeouts.clear();
  }
}
