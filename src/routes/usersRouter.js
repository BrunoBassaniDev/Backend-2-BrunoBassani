import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from '../utils.js';
import { UsuarioDTO } from '../dto/UsuarioDTO.js';

const router = Router();

router.get('/login', (req, res) => {
    if (req.signedCookies.currentUser) {
        return res.status(200).json({ status: 'success', redirectUrl: '/users/current' });
    }
    res.render('login');
});

router.get('/current', (req, res) => {
    if (!req.signedCookies.currentUser) {
        return res.status(200).json({ status: 'success', redirectUrl: '/users/login' });
    }
    try {
        const token = req.signedCookies.currentUser;
        const user = jwt.verify(token, SECRET);
        const userDTO = new UsuarioDTO(user);
        res.render('current', { user: userDTO });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(200).json({ status: 'success', redirectUrl: '/users/login' });
    }
});

export default router;