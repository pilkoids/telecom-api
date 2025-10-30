import { Cart } from '../domain/Cart';
import { ICartRepository } from './ICartRepository';
export declare class InMemoryCartRepository implements ICartRepository {
    private readonly store;
    constructor();
    save(cart: Cart): void;
    findById(id: string): Cart | null;
    delete(id: string): void;
    exists(id: string): boolean;
    getAll(): Cart[];
    clear(): void;
}
//# sourceMappingURL=InMemoryCartRepository.d.ts.map