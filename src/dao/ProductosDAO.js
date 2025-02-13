import Producto from '../models/product.model.js';

export class ProductosDAO {
    static async getProductos() {
        return Producto.find().lean();
    }

    static async getProductoById(id) {
        return Producto.findById(id).lean();
    }

    static async createProducto(producto) {
        return Producto.create(producto);
    }

    static async updateProducto(id, producto) {
        return Producto.findByIdAndUpdate(id, producto, { new: true });
    }

    static async deleteProducto(id) {
        return Producto.findByIdAndDelete(id);
    }
}