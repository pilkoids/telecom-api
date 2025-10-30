import { Request, Response } from 'express';
import { CartService } from '../services/CartService';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    createCart: (_req: Request, res: Response) => Promise<void>;
    addItem: (req: Request, res: Response) => Promise<void>;
    removeItem: (req: Request, res: Response) => Promise<void>;
    getCart: (req: Request, res: Response) => Promise<void>;
    getTotal: (req: Request, res: Response) => Promise<void>;
    private handleError;
}
//# sourceMappingURL=CartController.d.ts.map