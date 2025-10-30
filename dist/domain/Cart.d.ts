import { CartItem } from './CartItem';
export declare class Cart {
    readonly id: string;
    readonly contextId: string;
    readonly items: readonly CartItem[];
    readonly createdAt: Date;
    readonly expiresAt: Date;
    constructor(id: string, contextId: string, items: readonly CartItem[], createdAt: Date, expiresAt: Date);
    addItem(item: CartItem): Cart;
    removeItem(itemId: string): Cart;
    calculateTotal(): number;
    isExpired(): boolean;
    toJSON(): {
        id: string;
        contextId: string;
        items: {
            id: string;
            productId: string;
            name: string;
            type: import("./CartItem").CartItemType;
            price: number;
            quantity: number;
        }[];
        total: number;
        createdAt: string;
        expiresAt: string;
    };
}
//# sourceMappingURL=Cart.d.ts.map