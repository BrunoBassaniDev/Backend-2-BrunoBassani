import ProductManager from '../managers/ProductManager.js';
import { procesaErrores } from '../utils.js';

const productManager = new ProductManager();

export const createProduct = async (req, res) => {
    try {
        const product = await productManager.createProduct(req.body);
        res.status(201).json({ status: 'success', payload: product });
    } catch (error) {
        procesaErrores(res, error);
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.id);
        res.status(200).json({ status: 'success', payload: product });
    } catch (error) {
        procesaErrores(res, error);
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await productManager.getProducts(req.query);
        res.status(200).json({ status: 'success', payload: products });
    } catch (error) {
        procesaErrores(res, error);
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await productManager.updateProduct(req.params.id, req.body);
        res.status(200).json({ status: 'success', payload: product });
    } catch (error) {
        procesaErrores(res, error);
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await productManager.deleteById(req.params.id);
        res.status(200).json({ status: 'success', message: 'Product deleted' });
    } catch (error) {
        procesaErrores(res, error);
    }
};