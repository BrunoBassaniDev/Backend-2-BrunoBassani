import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import ErrorManager from './ErrorManager.js';

class CartManager {
    async insertOne(cartData) {
        if (!cartData.userId) {
            throw new ErrorManager('User ID is required', 400);
        }
        const cart = new Cart(cartData);
        await cart.save();
        return cart;
    }

    async getAll() {
        return Cart.find().lean();
    }

    async getOneById(id) {
        return Cart.findById(id).populate('products.product').lean();
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new ErrorManager('Cart not found', 404);
            }

            const product = await Product.findById(productId);
            if (!product) {
                throw new ErrorManager('Product not found', 404);
            }

            const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId);
            const currentQuantity = existingProductIndex !== -1 ? cart.products[existingProductIndex].quantity : 0;
            const totalQuantity = currentQuantity + quantity;

            if (totalQuantity > product.stock) {
                throw new ErrorManager('Not enough stock available', 400);
            }

            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity = totalQuantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            await cart.save();
            return cart;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async deleteOneProduct(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new ErrorManager('Cart not found', 404);
            }

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
            if (productIndex === -1) {
                throw new ErrorManager('Product not found in cart', 404);
            }

            cart.products.splice(productIndex, 1);
            await cart.save();
            return cart;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async purchaseCart(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate('products.product');
            if (!cart) {
                throw new ErrorManager('Cart not found', 404);
            }

            return { message: 'Purchase successful' };
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }
}

export default CartManager;