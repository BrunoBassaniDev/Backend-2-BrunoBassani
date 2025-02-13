import ProductosRepository from '../repositories/ProductosRepository.js';
import { CartsRepository } from '../repositories/CartsRepository.js';
import { TicketsRepository } from '../repositories/TicketsRepository.js';

export const CartsService = {
    async getAllCarts() {
        return await CartsRepository.getCarts();
    },

    async getCartById(id) {
        return await CartsRepository.getCartById(id);
    },

    async createCart(cartData) {
        return await CartsRepository.createCart(cartData);
    },

    async deleteCart(id) {
        return await CartsRepository.deleteCart(id);
    },

    async deleteProductFromCart(cartId, productId) {
        const cart = await CartsRepository.getCartById(cartId);
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex === -1) {
            throw new Error("Product not found in cart");
        }
        cart.products.splice(productIndex, 1);
        await CartsRepository.updateCart(cartId, cart);
        return cart;
    },

    async addProductToCart(cid, pid, quantity) {
        const cart = await CartsRepository.getCartById(cid);
        const product = await ProductosRepository.getProductoById(pid);

        if (!product) {
            throw new Error("Product not found");
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);

        if (productIndex >= 0) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        await CartsRepository.updateCart(cid, cart);

        return { message: 'Product added to cart', cart };
    },

    async purchaseCart(cid, email) {
        const cart = await CartsRepository.getCartById(cid);
        const conStock = [];
        const sinStock = [];
        let total = 0;

        for (let i = 0; i < cart.products.length; i++) {
            const producto = await ProductosRepository.getProductoById(cart.products[i].product);
            if (!producto || producto.stock < cart.products[i].quantity) {
                sinStock.push({
                    _id: cart.products[i].product,
                    cantidad: cart.products[i].quantity
                });
            } else {
                conStock.push({
                    _id: cart.products[i].product,
                    cantidad: cart.products[i].quantity,
                    descrip: producto.description,
                    title: producto.title,
                    price: producto.price,
                    subtotal: producto.price * cart.products[i].quantity
                });
                total += producto.price * cart.products[i].quantity;
                producto.stock -= cart.products[i].quantity;
                await ProductosRepository.updateProducto(cart.products[i].product, producto);
            }
        }

        if (conStock.length === 0) {
            throw new Error("No existen ítems en condiciones de ser adquiridos");
        }

        const nroComp = Date.now();
        const fecha = new Date();
        const detalle = conStock;
        const comprador = email;

        const ticket = await TicketsRepository.createTicket({
            nroComp,
            fecha,
            detalle,
            total,
            comprador
        });

        cart.products = sinStock;
        await CartsRepository.updateCart(cid, cart);

        return {
            payload: "Compra realizada con éxito",
            ticket
        };
    }
};