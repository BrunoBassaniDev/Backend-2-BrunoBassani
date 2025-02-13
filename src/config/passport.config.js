import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UsuariosRepository from '../repositories/UsuariosRepository.js';
import { isValidPassword, generaHash } from '../utils.js';
import { config } from './config.js'; 

passport.use('registro', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const existingUser = await UsuariosRepository.getUsuarioByEmail(email);
        if (existingUser) {
            return done(null, false, { message: 'Email ya existente' });
        }

        const hashedPassword = generaHash(password);
        const newUser = await UsuariosRepository.createUsuario({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email,
            age: req.body.age,
            password: hashedPassword,
            role: req.body.role || 'user'
        });

        return done(null, newUser);
    } catch (error) {
        return done(error);
    }
}));

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

passport.use('jwt', new JwtStrategy({
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
