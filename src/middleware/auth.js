import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UsuariosRepository from '../repositories/UsuariosRepository.js';
import { isValidPassword } from '../utils.js';

export const auth = (req, res, next) => {
    const token = req.signedCookies.currentUser;
    if (!token) {
        return res.status(401).json({ status: 'error', message: 'No estás autenticado' });
    }
    try {
        const user = jwt.verify(token, config.SECRET);
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ status: 'error', message: 'Token inválido o expirado' });
    }
};

export const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ status: 'error', message: 'No tienes permisos para realizar esta acción' });
        }
        next();
    };
};

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await UsuariosRepository.getUsuarioByEmail(email);
        if (!user) {
            return done(null, false, { message: 'Email no registrado' });
        }
        if (!isValidPassword(password, user.password)) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.use('current', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.signedCookies.currentUser]),
    secretOrKey: config.SECRET
}, async (jwtPayload, done) => {
    try {
        const user = await UsuariosRepository.getUsuarioById(jwtPayload.id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

export const iniciarPassport = () => {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UsuariosRepository.getUsuarioById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};