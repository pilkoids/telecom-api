import { CartItem } from '../domain/CartItem';
import { ISalesforceCartClient } from './ISalesforceCartClient';
export declare class SalesforceContextError extends Error {
    constructor(message: string);
}
interface SalesforceContext {
    cartId: string;
    items: Map<string, CartItem>;
    createdAt: Date;
    expiresAt: Date;
}
export declare class MockSalesforceAdapter implements ISalesforceCartClient {
    private readonly contexts;
    private readonly expiryMs;
    constructor(expiryMs: number);
    createCartContext(cartId: string): string;
    addItemToContext(contextId: string, item: CartItem): void;
    removeItemFromContext(contextId: string, itemId: string): void;
    calculateTotal(contextId: string): number;
    contextExists(contextId: string): boolean;
    deleteContext(contextId: string): void;
    private getValidContext;
    getAllContexts(): SalesforceContext[];
    clear(): void;
}
export {};
//# sourceMappingURL=MockSalesforceAdapter.d.ts.map