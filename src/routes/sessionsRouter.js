import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { usuariosModelo as User } from '../models/usuarios.model.js';
import { SECRET } from '../utils.js';

export const router = Router();

router.post(
    '/registro',
    passport.authenticate("registro", { session: false }),
    (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ payload: "Usuario registrado", usuarioCreado: req.user });
    }
);

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: info.message });

        const token = jwt.sign(user.toObject(), SECRET, { expiresIn: '1h' }); 
        res.cookie('cookietoken', token, { httpOnly: true });
        res.status(200).json({ status: 'success', message: 'Login successful', redirectUrl: '/products' });
    })(req, res, next);
});

router.get("/github", passport.authenticate("github"));
router.get("/callbackGithub", passport.authenticate("github", { session: false }), (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ payload: "Login exitoso", usuario: req.user });
});

router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    res.json(req.user);
});

router.get('/logout', (req, res) => {
    res.clearCookie('currentUser');
    res.status(200).json({ status: 'success', message: 'Logout successful', redirectUrl: '/users/login' });
});

export default router;