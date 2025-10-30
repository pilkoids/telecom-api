import { CartItem } from '../domain/CartItem';
import { ISalesforceCartClient } from './ISalesforceCartClient';

export class SalesforceContextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SalesforceContextError';
  }
}

interface SalesforceContext {
  cartId: string;
  items: Map<string, CartItem>;
  createdAt: Date;
  expiresAt: Date;
}

export class MockSalesforceAdapter implements ISalesforceCartClient {
  private readonly contexts: Map<string, SalesforceContext>;
  private readonly expiryMs: number;

  constructor(expiryMs: number) {
    this.contexts = new Map();
    this.expiryMs = expiryMs;
  }

  createCartContext(cartId: string): string {
    const contextId = cartId; // Using cartId as contextId for simplicity
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.expiryMs);

    this.contexts.set(contextId, {
      cartId,
      items: new Map(),
      createdAt: now,
      expiresAt,
    });

    return contextId;
  }

  addItemToContext(contextId: string, item: CartItem): void {
    const context = this.getValidContext(contextId);

    if (context.items.has(item.id)) {
      throw new SalesforceContextError(`Item with ID '${item.id}' already exists in context`);
    }

    context.items.set(item.id, item);
  }

  removeItemFromContext(contextId: string, itemId: string): void {
    const context = this.getValidContext(contextId);

    if (!context.items.has(itemId)) {
      throw new SalesforceContextError(`Item with ID '${itemId}' not found in context`);
    }

    context.items.delete(itemId);
  }

  calculateTotal(contextId: string): number {
    const context = this.getValidContext(contextId);

    let total = 0;
    for (const item of context.items.values()) {
      total += item.getTotalPrice();
    }

    return total;
  }

  contextExists(contextId: string): boolean {
    const context = this.contexts.get(contextId);
    if (!context) {
      return false;
    }

    // Check if expired
    if (new Date() > context.expiresAt) {
      this.contexts.delete(contextId);
      return false;
    }

    return true;
  }

  deleteContext(contextId: string): void {
    this.contexts.delete(contextId);
  }

  private getValidContext(contextId: string): SalesforceContext {
    const context = this.contexts.get(contextId);

    if (!context) {
      throw new SalesforceContextError(`Context '${contextId}' not found`);
    }

    // Check if expired
    if (new Date() > context.expiresAt) {
      this.contexts.delete(contextId);
      throw new SalesforceContextError(`Context '${contextId}' has expired`);
    }

    return context;
  }

  // Helper for testing
  getAllContexts(): SalesforceContext[] {
    return Array.from(this.contexts.values());
  }

  // Helper for testing
  clear(): void {
    this.contexts.clear();
  }
}
