import { ICartRepository } from './ICartRepository';
import { ISalesforceCartClient } from './ISalesforceCartClient';
export declare class ExpiryScheduler {
    private readonly cartRepository;
    private readonly salesforceClient;
    private readonly timeouts;
    constructor(cartRepository: ICartRepository, salesforceClient: ISalesforceCartClient);
    scheduleExpiry(cartId: string, contextId: string, expiryMs: number): void;
    cancelExpiry(cartId: string): void;
    private expireCart;
    clearAll(): void;
}
//# sourceMappingURL=ExpiryScheduler.d.ts.map