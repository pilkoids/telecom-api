export type CartItemType = 'plan' | 'phone' | 'accessory';
export declare class CartItem {
    readonly id: string;
    readonly productId: string;
    readonly name: string;
    readonly type: CartItemType;
    readonly price: number;
    readonly quantity: number;
    constructor(id: string, productId: string, name: string, type: CartItemType, price: number, quantity: number);
    private validate;
    equals(other: CartItem): boolean;
    getTotalPrice(): number;
}
//# sourceMappingURL=CartItem.d.ts.map