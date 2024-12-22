import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema({
    title:{
        type: String,
        required: [ true, "Es obligatorio ingresar un título" ],
        uppercase: true,
        trim: true,
    },
    description:{
        type: String,
        required: [ true, "Es obligatorio ingresar una descripción" ],
        trim: true,
    },
    category:{
        type: String,
        required: [ true, "Es obligatorio ingresar una categoría" ],
        trim: true,
        minLength: [ 2, "Ingresa al menos 2 caracteres" ],
        maxLength: [ 20, "Máximo 20 caracteres" ],
    },
    code:{
        type: String,
        required: [ true, "Es obligatorio ingresar un código" ],
        validate: {
            validator: async function (code) {
                const countDocuments = await this.model("products").countDocuments({
                    _id:{ $ne: this._id },
                    code,
                });
                return countDocuments===0;
            },
            message: "Este código ya se usó",
        },
        lowercase: true,
        trim: true,
        unique: true,
    },
    price:{
        type: Number,
        required: [ true, "Es obligatorio ingresar un precio" ],
        min: [ 1, "El precio debe ser un número mayor o igual a 1" ],
    },
    stock:{
        type: Number,
        required: [ true, "Es obligatorio ingresar un stock" ],
        min: [ 1, "El stock debe ser un número mayor o igual a 1" ],
    },
    status:{
        type: Boolean,
        required: [ true, "Es obligatorio ingresar un status" ],
    },
    thumbnail:{
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});

productSchema.plugin(paginate);

const ProductModel = model("products", productSchema);

export default ProductModel;