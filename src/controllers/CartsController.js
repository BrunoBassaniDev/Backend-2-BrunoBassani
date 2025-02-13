import { CartsService } from '../services/CartsService.js';
import { procesaErrores } from '../utils.js';
import mongoose from 'mongoose';
import CartManager from '../managers/CartManager.js';

const cartManager = new CartManager();

export const getAllCarts = async (req, res) => {
    try {
        const carts = await CartsService.getAllCarts();
        res.status(200).json({ status: "success", payload: carts });
    } catch (error) {
        procesaErrores(res, error);
    }
};

export const getCartById = async (req, res) => {
    const { cid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(400).json({ error: "Ingrese un id de cart válido (mongodb object id)" });
    }

    try {
        const cart = await CartsService.getCartById(cid);
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        procesaErrores(res, error);
    }
};

export const createCart = async (req, res) => {
    try {
        const cart = await CartsService.createCart(req.body);
        res.status(201).json({ status: "success", payload: cart });
    } catch (error) {
        procesaErrores(res, error);
    }
};

export const deleteCart = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ status: "error", message: "Invalid cart ID" });
    }

    try {
        const cartDeleted = await CartsService.deleteCart(id);
        res.status(200).json({ status: true, payload: cartDeleted });
    } catch (error) {
        procesaErrores(res, error);
    }
};

export const deleteProductFromCart = async (req, res) => {
    const { id, pid: productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ status: "error", message: "Invalid cart or product ID" });
    }

    try {
        const cartDeleted = await CartsService.deleteProductFromCart(id, productId);
        res.status(200).json({ status: true, payload: cartDeleted });
    } catch (error) {
        procesaErrores(res, error);
    }
};

export const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await cartManager.addProductToCart(cid, pid, quantity);
        res.status(200).json({ status: 'success', cart });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
};

export const purchaseCart = async (req, res) => {
    const { cid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(400).json({ error: "Ingrese un id de cart válido (mongodb object id)" });
    }

    if (req.user.cart != cid) {
        return res.status(400).json({ error: "El cart elegido no pertenece al usuario autenticado" });
    }

    try {
        const result = await CartsService.purchaseCart(cid, req.user.email);
        res.status(200).json(result);
    } catch (error) {
        procesaErrores(res, error);
    }
};