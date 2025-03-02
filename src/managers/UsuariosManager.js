import { usuariosModelo } from "../models/usuarios.model.js";
import { generaHash, isValidPassword } from "../utils.js";

class UsuariosManager {
    async registerUser(userData) {
        const existeUsuario = await usuariosModelo.findOne({ email: userData.email }).lean();

        if (existeUsuario) {
            throw new Error("El usuario ya existe");
        }

        userData.password = await generaHash(userData.password);
        return await usuariosModelo.create(userData);
    }

    async loginUser(email, password) {
        const user = await usuariosModelo.findOne({ email }).lean();

        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        if (!isValidPassword(password, user.password)) {
            throw new Error("Contraseña incorrecta");
        }

        return user;
    }

    async getUsers() {
        try {
            return await usuariosModelo.find().lean();
        } catch (error) {
            console.error(error);
            throw new Error("Error al obtener los usuarios");
        }
    }
}

export default UsuariosManager;
