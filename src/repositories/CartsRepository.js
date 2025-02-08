import { CartsDAO } from "../dao/CartsDAO.js";

export class CartsRepository {
    static async getCarts() {
        return CartsDAO.getCarts();
    }

    static async getCartById(id) {
        return CartsDAO.getCartById(id);
    }

    static async createCart(cart) {
        return CartsDAO.createCart(cart);
    }

    static async updateCart(id, cart) {
        return CartsDAO.updateCart(id, cart);
    }

    static async deleteCart(id) {
        return CartsDAO.deleteCart(id);
    }
}