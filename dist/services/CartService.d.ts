import { Cart } from '../domain/Cart';
import { CartItem } from '../domain/CartItem';
import { CartFactory } from '../domain/CartFactory';
import { ICartRepository } from '../infrastructure/ICartRepository';
import { ISalesforceCartClient } from '../infrastructure/ISalesforceCartClient';
import { ExpiryScheduler } from '../infrastructure/ExpiryScheduler';
export declare class CartService {
    private readonly cartRepository;
    private readonly salesforceClient;
    private readonly cartFactory;
    private readonly expiryScheduler;
    private readonly expiryMs;
    constructor(cartRepository: ICartRepository, salesforceClient: ISalesforceCartClient, cartFactory: CartFactory, expiryScheduler: ExpiryScheduler, expiryMs: number);
    createCart(): Cart;
    addItem(cartId: string, item: CartItem): Cart;
    removeItem(cartId: string, itemId: string): Cart;
    getCart(cartId: string): Cart;
    getTotal(cartId: string): number;
    private getValidCart;
}
//# sourceMappingURL=CartService.d.ts.map