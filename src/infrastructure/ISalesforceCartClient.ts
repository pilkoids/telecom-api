import { CartItem } from '../domain/CartItem';

export interface ISalesforceCartClient {
  createCartContext(cartId: string): string;
  addItemToContext(contextId: string, item: CartItem): void;
  removeItemFromContext(contextId: string, itemId: string): void;
  calculateTotal(contextId: string): number;
  contextExists(contextId: string): boolean;
  deleteContext(contextId: string): void;
}
