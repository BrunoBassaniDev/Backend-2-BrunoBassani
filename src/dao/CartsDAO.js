import CartModel from '../models/cart.model.js';

export class CartsDAO {
    static async getCarts() {
        return CartModel.find().lean();
    }

    static async getCartById(id) {
        return CartModel.findById(id).lean();
    }

    static async createCart(cart) {
        return CartModel.create(cart);
    }

    static async updateCart(id, cart) {
        return CartModel.findByIdAndUpdate(id, cart, { new: true });
    }

    static async deleteCart(id) {
        return CartModel.findByIdAndDelete(id);
    }
}