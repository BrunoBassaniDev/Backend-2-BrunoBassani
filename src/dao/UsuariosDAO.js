import { usuariosModelo } from "../models/usuarios.model.js";

export class UsuariosDAO {
    static async getUsuarios() {
        return usuariosModelo.find().lean();
    }

    static async getUsuarioById(id) {
        return usuariosModelo.findById(id).lean();
    }

    static async getUsuarioByEmail(email) {
        return usuariosModelo.findOne({ email }).lean();
    }

    static async createUsuario(usuario) {
        return usuariosModelo.create(usuario);
    }

    static async updateUsuario(id, usuario) {
        return usuariosModelo.findByIdAndUpdate(id, usuario, { new: true });
    }

    static async deleteUsuario(id) {
        return usuariosModelo.findByIdAndDelete(id);
    }
}