import { Router } from 'express';
import { UsuariosRepository } from '../repositories/UsuariosRepository.js';
import { generaHash, isValidPassword } from '../utils.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import nodemailer from 'nodemailer';

const router = Router();

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await UsuariosRepository.getUsuarioByEmail(email);
    if (!user) {
        return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }
    const token = jwt.sign({ id: user._id }, config.SECRET, { expiresIn: '1h' });
    const resetLink = `http://localhost:8080/reset-password/${token}`;

    // Configura el transporte de nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASS
        }
    });

    // Configura el correo electrónico
    const mailOptions = {
        from: config.EMAIL_USER,
        to: email,
        subject: 'Restablecimiento de contraseña',
        html: `<p>Haga clic en el siguiente enlace para restablecer su contraseña:</p><a href="${resetLink}">Restablecer contraseña</a>`
    };

    // Envía el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ status: 'error', message: 'Error al enviar el correo electrónico' });
        }
        res.status(200).json({ status: 'success', message: 'Correo electrónico enviado' });
    });
});

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const decoded = jwt.verify(token, config.SECRET);
        const user = await UsuariosRepository.getUsuarioById(decoded.id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }
        if (isValidPassword(password, user.password)) {
            return res.status(400).json({ status: 'error', message: 'No se puede usar la misma contraseña' });
        }
        user.password = generaHash(password);
        await UsuariosRepository.updateUsuario(user._id, user);
        res.status(200).json({ status: 'success', message: 'Contraseña restablecida' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ status: 'error', message: 'El enlace ha expirado' });
        }
        res.status(500).json({ status: 'error', message: 'Error al restablecer la contraseña' });
    }
});

export default router;