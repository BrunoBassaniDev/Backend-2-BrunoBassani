import { ProductosDAO } from "../dao/ProductosDAO.js";

export class ProductosRepository {
    static async getProductos() {
        return ProductosDAO.getProductos();
    }

    static async getProductoById(id) {
        return ProductosDAO.getProductoById(id);
    }

    static async createProducto(producto) {
        return ProductosDAO.createProducto(producto);
    }

    static async updateProducto(id, producto) {
        return ProductosDAO.updateProducto(id, producto);
    }

    static async deleteProducto(id) {
        return ProductosDAO.deleteProducto(id);
    }
}