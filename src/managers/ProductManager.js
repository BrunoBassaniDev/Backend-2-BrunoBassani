import paths from "../utils/paths.js";
import { readJsonFile, writeJsonFile, deleteFile } from "../utils/fileHandler.js";
import { generateId } from "../utils/collectionHandler.js";
import { convertToBoolean } from "../utils/converter.js";
import ErrorManager from "./ErrorManager.js";

export default class ProductManager{
    #jsonFilename;
    #products;

    constructor(){
        this.#jsonFilename= "products.json";
    }

    async $findOneById(id){
        this.#products = await this.getAll();
        const productFound= this.#products.find((item)=> item.id === Number(id));
        console.log("Producto encontrado:", productFound);

        if (!productFound) {
            console.log("Producto NO encontrado:");
            throw new ErrorManager("Id no encontrado", 404);
        }
        return productFound;
    }

    async getAll(){
        try {
            this.#products = await readJsonFile(paths.files, this.#jsonFilename);
            return this.#products;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }
    async getOneById(id){
        try {
            const productFound= await this.$findOneById(id);
            return productFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async insertOne(data, file){
        try {
            const { title, description, code, price, status, stock, category } = data;

            if (!title || !stock || !description || !code || !price || !category) {
                throw new ErrorManager("Faltan datos obligatorios", 400);
            }

            const product={
                id: generateId(await this.getAll()),
                title,
                description,
                code,
                price: Number(price),
                status: convertToBoolean(status) || "of",
                stock: Number(stock),
                category,
                thumbnail: file?.filename ?? "image-not-found.jpg",
            };

            this.#products.push(product);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#products);

            return product;
        } catch (error) {
            if (file?.filename) await deleteFile(paths.images, file.filename);
            throw new ErrorManager(error.message, error.code);
        }
    }

    async updateOneById(id, data, file){
        try {
            const { title, description, code, price, status, stock, category } = data;
            const productFound= await this.$findOneById(id);
            const newThumbnail = file?.filename;

            const product={
                id: productFound.id,
                title: title || productFound.title,
                description: description || productFound.description,
                code: code || productFound.code,
                price: price ? Number(price): productFound.price,
                status: status ? convertToBoolean(status): productFound.status,
                stock: stock ? Number(stock): productFound.stock,
                category: category || productFound.category,
                thumbnail: newThumbnail || productFound.thumbnail,
            };

            const index = this.#products.findIndex((item)=>item.id === Number(id));
            this.#products[index] = product;
            await writeJsonFile(paths.files, this.#jsonFilename, this.#products);

            if (file?.filename && newThumbnail !== productFound.thumbnail) {
                await deleteFile(paths.images, productFound.thumbnail);
            }

            return product;
        } catch (error) {
            if (file?.filename) await deleteFile(paths.images, file.filename);
            throw new ErrorManager(error.message, error.code);
        }
    }

    async deleteOneById(id){
        try {
            const productFound = await this.$findOneById(id);

            if (productFound.thumbnail && productFound.thumbnail !== "image-not-found.jpg") {
                await deleteFile(paths.images, productFound.thumbnail);
            }

            const index = this.#products.findIndex((item)=>item.id === Number(id));
            this.#products.splice(index, 1);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#products);

        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }
}