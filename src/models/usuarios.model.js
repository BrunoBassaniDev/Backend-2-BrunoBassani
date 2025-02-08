import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: { type: String, default: 'user' }
}, { timestamps: true });

export const usuariosModelo = mongoose.model('Usuario', usuarioSchema);