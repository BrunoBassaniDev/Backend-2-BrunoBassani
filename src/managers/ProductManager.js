import Product from "../models/product.model.js";

class ProductManager {
    async createProduct(productData) {
        return await Product.create(productData);
    }

    async getProductById(id) {
        return await Product.findById(id).lean();
    }

    async getProducts(query) {
        return await Product.find(query).lean();
    }

    async getAll({ page = 1, sort = "asc" }) {
        const options = {
            page,
            limit: 10,
            sort: { title: sort === "asc" ? 1 : -1 }
        };
        return await Product.paginate({}, options);
    }

    async updateProduct(id, productData) {
        return await Product.findByIdAndUpdate(id, productData, { new: true }).lean();
    }

    async deleteById(id) {
        return await Product.findByIdAndDelete(id).lean();
    }
}

export default ProductManager;