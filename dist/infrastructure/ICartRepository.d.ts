import { Cart } from '../domain/Cart';
export interface ICartRepository {
    save(cart: Cart): void;
    findById(id: string): Cart | null;
    delete(id: string): void;
    exists(id: string): boolean;
}
//# sourceMappingURL=ICartRepository.d.ts.map