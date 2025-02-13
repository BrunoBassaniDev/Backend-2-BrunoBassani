import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import UsuariosRepository from '../repositories/UsuariosRepository.js';
import { generaHash, isValidPassword } from '../utils.js';
import { UsuarioDTO } from '../dto/UsuarioDTO.js';
import { auth } from '../middleware/auth.js';

const router = Router();

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

        res.status(201).json({ status: 'success', message: 'User registered', user: new UsuarioDTO(newUser) });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error registering user', error: error.message });
    }
});

router.post('/login', async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: info.message });

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, config.SECRET, { expiresIn: '1h' });
        res.cookie('currentUser', token, { signed: true, httpOnly: true });
        res.status(200).json({ status: 'success', message: 'Login successful', redirectUrl: '/api/sessions/current' });
    })(req, res, next);
});

router.get('/current', auth, passport.authenticate('current', { session: false }), (req, res) => {
    const userDTO = new UsuarioDTO(req.user);
    res.status(200).json({ status: 'success', user: userDTO });
});

router.get('/login', (req, res) => {
    res.render('login');
});

export default router;