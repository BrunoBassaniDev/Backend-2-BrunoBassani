import { UsuariosDAO } from "../dao/UsuariosDAO.js";

class UsuariosRepository {
    async getUsuarioByEmail(email) {
        return await UsuariosDAO.getUsuarioByEmail(email);
    }

    async createUsuario(userData) {
        return await UsuariosDAO.createUsuario(userData);
    }

    async getUsuarios() {
        return await UsuariosDAO.getUsuarios();
    }

    async getUsuarioById(id) {
        return await UsuariosDAO.getUsuarioById(id);
    }

    async updateUsuario(id, userData) {
        return await UsuariosDAO.updateUsuario(id, userData);
    }
}

export default new UsuariosRepository();