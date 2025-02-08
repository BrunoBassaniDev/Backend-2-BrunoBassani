import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { usuariosModelo as User } from '../models/usuarios.model.js';
import { config } from '../config/config.js';
import { generaHash, isValidPassword } from '../utils.js';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager();

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    const hashedPassword = generaHash(password);
    const newCart = await cartManager.insertOne({ products: [] });
    const newUser = new User({ first_name, last_name, email, age, password: hashedPassword, cart: newCart._id, role: 'user' });
    await newUser.save();
    res.status(201).json({ status: 'success', message: 'User registered', user: newUser });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean();
    if (!user || !isValidPassword(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'Login failed!' });
    }
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        user.role = "admin";
    } else {
        user.role = "user";
    }
    const token = jwt.sign({ ...user }, config.SECRET, { expiresIn: '1h' });
    res.cookie('currentUser', token, { signed: true, httpOnly: true });
    res.status(200).json({ status: 'success', message: 'Login successful', redirectUrl: '/users/current' });
});

export default router;