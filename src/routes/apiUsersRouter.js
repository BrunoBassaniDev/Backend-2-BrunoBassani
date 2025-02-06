import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { usuariosModelo as User } from '../models/usuarios.model.js';
import { SECRET, generaHash, isValidPassword } from '../utils.js';

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean(); // Use lean() to get a plain JavaScript object
    if (!user || !isValidPassword(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'Login failed!' });
    }
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        user.role = "admin";
    } else {
        user.role = "user";
    }
    const token = jwt.sign(user, SECRET, { expiresIn: '1h' });
    res.cookie('currentUser', token, { signed: true, httpOnly: true });
    res.status(200).json({ status: 'success', message: 'Login successful', redirectUrl: '/users/current' });
});

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password, cart } = req.body;
    const hashedPassword = generaHash(password);
    const newUser = new User({ first_name, last_name, email, age, password: hashedPassword, cart, role: 'user' });
    await newUser.save();
    res.status(201).json({ status: 'success', message: 'User registered', redirectUrl: '/users/login' });
});

export default router;