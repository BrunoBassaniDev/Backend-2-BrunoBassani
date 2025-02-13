import { generaHash, isValidPassword } from "../utils.js";
import UsuariosRepository from "../repositories/UsuariosRepository.js";

class UserService {
    async registerUser(userData) {
        const existeUsuario = await UsuariosRepository.getUsuarioByEmail(userData.email);

        if (existeUsuario) {
            throw new Error("El usuario ya existe");
        }

        userData.password = await generaHash(userData.password);
        return await UsuariosRepository.createUsuario(userData);
    }

    async loginUser(email, password) {
        const user = await UsuariosRepository.getUsuarioByEmail(email);

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
            return await UsuariosRepository.getUsuarios();
        } catch (error) {
            console.error(error);
            throw new Error("Error al obtener los usuarios");
        }
    }
}

export default new UserService();