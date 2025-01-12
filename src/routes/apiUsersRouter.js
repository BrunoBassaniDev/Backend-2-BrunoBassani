import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { usuariosModelo as User } from '../models/usuarios.model.js';
import { SECRET } from '../utils.js';
import bcrypt from 'bcrypt';

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).send('Login failed!');
    }
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        user.role = "admin";
    } else {
        user.role = "user";
    }
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, SECRET, { expiresIn: '1h' });
    res.cookie('currentUser', token, { signed: true, httpOnly: true });
    res.redirect('/users/current');
});

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password, cart } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ first_name, last_name, email, age, password: hashedPassword, cart, role: 'user' });
    await newUser.save();
    res.status(201).send('User registered');
});

router.get('/', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
});

router.put('/:id', async (req, res) => {
    const { first_name, last_name, email, age, password, cart, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { first_name, last_name, email, age, password: hashedPassword, cart, role }, { new: true });
    res.json(updatedUser);
});

router.delete('/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.send('User deleted');
});

export default router;