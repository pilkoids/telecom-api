"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCartRepository = void 0;
class InMemoryCartRepository {
    store;
    constructor() {
        this.store = new Map();
    }
    save(cart) {
        this.store.set(cart.id, cart);
    }
    findById(id) {
        return this.store.get(id) || null;
    }
    delete(id) {
        this.store.delete(id);
    }
    exists(id) {
        return this.store.has(id);
    }
    // Helper for testing - get all carts
    getAll() {
        return Array.from(this.store.values());
    }
    // Helper for testing - clear all
    clear() {
        this.store.clear();
    }
}
exports.InMemoryCartRepository = InMemoryCartRepository;
//# sourceMappingURL=InMemoryCartRepository.js.map