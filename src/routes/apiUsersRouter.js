import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import UsuariosRepository from '../repositories/UsuariosRepository.js';
import { generaHash, isValidPassword } from '../utils.js';
import { UsuarioDTO } from '../dto/UsuarioDTO.js';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager();

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password, role } = req.body;
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

        res.status(201).json({ status: 'success', message: 'User registered', user: new UsuarioDTO(newUser), cart: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error registering user', error: error.message });
    }
});

router.post('/login', async (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: info.message });

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, config.SECRET, { expiresIn: '1h' });
        res.cookie('currentUser', token, { signed: true, httpOnly: true });

        const cart = await cartManager.getOneById(user.cart);

        res.status(200).json({ status: 'success', message: 'Login successful', user: new UsuarioDTO(user), cart, redirectUrl: '/users/current' });
    })(req, res, next);
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    const userDTO = new UsuarioDTO(req.user);
    res.status(200).json({ status: 'success', user: userDTO });
});

export default router;