import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import { config } from './config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const SECRET = config.SECRET;

export const procesaErrores = (res, error) => {
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
};

export const generaHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};