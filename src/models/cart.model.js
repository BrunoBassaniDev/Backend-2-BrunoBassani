import mongoose from 'mongoose';
import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import UsuariosRepository from '../repositories/UsuariosRepository.js';
import { config } from '../config/config.js';
import { generaHash, isValidPassword } from '../utils.js';
import CartManager from '../managers/CartManager.js';
import { UsuarioDTO } from '../dto/UsuarioDTO.js';

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, required: true }
        }
    ]
}, { collection: 'carts' });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;

const router = Router();

const createCartManager = () => new CartManager();

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password, role } = req.body;
    const cartManager = createCartManager();
    try {
        const existingUser = await UsuariosRepository.getUsuarioByEmail(email);
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'Email ya existente' });
        }

        const hashedPassword = generaHash(password);
        const newUser = await UsuariosRepository.createUsuario({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            role: role || 'user'
        });

        const newCart = await cartManager.insertOne({ userId: newUser._id, products: [] });

        newUser.cart = newCart._id;
        await UsuariosRepository.updateUsuario(newUser._id, newUser);

        res.status(201).json({ status: 'success', message: 'User registered', user: new UsuarioDTO(newUser) });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error registering user', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const cartManager = createCartManager();
    try {
        const user = await UsuariosRepository.getUsuarioByEmail(email);
        if (!user || !isValidPassword(password, user.password)) {
            return res.status(401).json({ status: 'error', message: 'Login failed!' });
        }
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, config.SECRET, { expiresIn: '1h' });
        res.cookie('currentUser', token, { signed: true, httpOnly: true });
        res.status(200).json({ status: 'success', message: 'Login successful', user: new UsuarioDTO(user), redirectUrl: '/api/products' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error logging in', error: error.message });
    }
});

router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    const userDTO = new UsuarioDTO(req.user);
    res.status(200).json({ status: 'success', user: userDTO });
});