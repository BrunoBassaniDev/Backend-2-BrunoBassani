import UsuariosManager from '../managers/UsuariosManager.js';
import { procesaErrores } from '../utils.js';

const usuariosManager = new UsuariosManager();

export const registerUser = async (req, res) => {
    try {
        const user = await usuariosManager.registerUser(req.body);
        res.status(201).json({ status: 'success', payload: user });
    } catch (error) {
        procesaErrores(res, error);
    }
};

export const loginUser = async (req, res) => {
    try {
        const user = await usuariosManager.loginUser(req.body.email, req.body.password);
        res.status(200).json({ status: 'success', payload: user });
    } catch (error) {
        procesaErrores(res, error);
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await usuariosManager.getUsers();
        res.status(200).json({ status: 'success', payload: users });
    } catch (error) {
        procesaErrores(res, error);
    }
};