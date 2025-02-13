import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import UsuariosRepository from '../repositories/UsuariosRepository.js';
import { generaHash, isValidPassword } from '../utils.js';
import { UsuarioDTO } from '../dto/UsuarioDTO.js';

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
        res.status(200).json({ status: 'success', message: 'Login successful' });
    })(req, res, next);
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    const userDTO = new UsuarioDTO(req.user);
    res.status(200).json({ status: 'success', user: userDTO });
});

export default router;

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const response = await fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();

    if (data.status === 'success') {
        window.location.href = data.redirectUrl;
    } else {
        alert(data.message);
    }
});

let divDatos = document.getElementById("datos")
let btnDatos = document.getElementById("btnDatos")
btnDatos.addEventListener("click", async (e) => {
    let respuesta = await fetch("/usuario")
    if(respuesta.status>=400){
        divDatos.textContent = respuesta.statusText
        return
    }
    try {
        let datos = await respuesta.json()
        console.log(datos)
        divDatos.textContent = JSON.stringify(datos, null, 5)
    } catch (error) {
        divDatos.textContent = "Error...!!!"
    }
})
