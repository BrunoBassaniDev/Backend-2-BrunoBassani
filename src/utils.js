import bcrypt from "bcrypt"
import {fileURLToPath} from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generarHash=pass=>bcrypt.hashSync(pass, 10)
export const SECRET="CoderCoder123"
export default __dirname;



