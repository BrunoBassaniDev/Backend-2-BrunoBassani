import { UsuariosDAO } from "../dao/UsuariosDAO.js";

export class UsuariosRepository {
    static async getUsuarios() {
        return UsuariosDAO.getUsuarios();
    }

    static async getUsuarioById(id) {
        return UsuariosDAO.getUsuarioById(id);
    }

    static async getUsuarioByEmail(email) {
        return UsuariosDAO.getUsuarioByEmail(email);
    }

    static async createUsuario(usuario) {
        return UsuariosDAO.createUsuario(usuario);
    }

    static async updateUsuario(id, usuario) {
        return UsuariosDAO.updateUsuario(id, usuario);
    }

    static async deleteUsuario(id) {
        return UsuariosDAO.deleteUsuario(id);
    }
}