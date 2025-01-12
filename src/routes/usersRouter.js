import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { usuariosModelo as User } from '../models/usuarios.model.js';

const router = Router();

router.get('/login', (req, res) => {
    if (req.signedCookies.currentUser) {
        return res.redirect('/users/current');
    }
    res.render('login');
});

router.get('/current', auth, (req, res) => {
    res.render('current', { user: req.user });
});

export default router;