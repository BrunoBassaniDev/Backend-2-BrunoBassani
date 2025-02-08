import ErrorManager from "./ErrorManager.js";
import { isValidID } from "../config/mongoose.config.js";
import ProductModel from "../models/product.model.js";

export default class ProductManager {
    #productModel;

    constructor() {
        this.#productModel = ProductModel;
    }

    async #findOneById(id) {
        if (!isValidID(id)) {
            throw new ErrorManager("ID inválido", 400);
        }
        const product = await this.#productModel.findById(id);
        if (!product) {
            throw new ErrorManager("ID no encontrado", 404);
        }
        return product;
    }

    async getAll(params) {
        try {
            const paginationOptions = {
                limit: params?.limit || 10,
                page: params?.page || 1,
                lean: true,
            };

            return await this.#productModel.paginate({}, paginationOptions);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async getOneById(id) {
        try {
            return await this.#findOneById(id);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async insertOne(data) {
        try {
            const product = await this.#productModel.create(data);
            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async updateOne(id, data) {
        try {
            const product = await this.#findOneById(id);
            Object.assign(product, data);
            await product.save();
            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async deleteOneById(id) {
        try {
            const product = await this.#findOneById(id);
            await this.#productModel.findByIdAndDelete(id);
            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }
}