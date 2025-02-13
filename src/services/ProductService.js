import productRepository from "../repositories/ProductosRepository.js";

class ProductService {
    async createProduct(productData) {
        return await productRepository.createProducto(productData);
    }

    async getProductById(id) {
        return await productRepository.getProductoById(id);
    }

    async getProducts(query) {
        return await productRepository.getProductos(query);
    }

    async updateProduct(id, productData) {
        return await productRepository.updateProducto(id, productData);
    }

    async deleteById(id) {
        return await productRepository.deleteProducto(id);
    }
}

export default new ProductService();