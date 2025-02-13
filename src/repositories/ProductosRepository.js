import ProductModel from "../models/product.model.js";

class ProductosRepository {
    async createProducto(productData) {
        return await ProductModel.create(productData);
    }

    async getProductoById(id) {
        return await ProductModel.findById(id).lean();
    }

    async getProductos(query) {
        return await ProductModel.find(query).lean();
    }

    async updateProducto(id, productData) {
        return await ProductModel.findByIdAndUpdate(id, productData, { new: true }).lean();
    }

    async deleteProducto(id) {
        return await ProductModel.findByIdAndDelete(id).lean();
    }
}

export default new ProductosRepository();