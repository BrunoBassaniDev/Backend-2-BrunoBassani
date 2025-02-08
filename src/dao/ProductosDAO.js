import ProductModel from '../models/product.model.js';

export class ProductosDAO {
    static async getProductos() {
        return ProductModel.find().lean();
    }

    static async getProductoById(id) {
        return ProductModel.findById(id).lean();
    }

    static async createProducto(producto) {
        return ProductModel.create(producto);
    }

    static async updateProducto(id, producto) {
        return ProductModel.findByIdAndUpdate(id, producto, { new: true });
    }

    static async deleteProducto(id) {
        return ProductModel.findByIdAndDelete(id);
    }
}