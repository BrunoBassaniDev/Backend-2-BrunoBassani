import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GitHubStrategy } from "passport-github2";
import { SECRET } from "../utils.js";
import { generarHash } from "../utils.js";
import { config } from "./config.js";
import { UsuariosManager } from "../managers/UsuariosManager.js";
import bcrypt from "bcrypt";

const buscaToken = req => {
    let token = null;
    if (req.cookies.cookietoken) {
        token = req.cookies.cookietoken;
    }
    return token;
};

export const iniciarPassport = () => {
    passport.use("registro",
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true
            },
            async (req, email, password, done) => {
                try {
                    let { first_name, last_name, age, cart, role } = req.body;
                    if (!first_name || !last_name || !email) {
                        console.log("No se ingreso nombre o email");
                        return done(null, false);
                    }

                    let existe = await UsuariosManager.getBy({ email });
                    if (existe) {
                        return done(null, false);
                    }

                    password = generarHash(password);

                    let nuevoUsuario = await UsuariosManager.create({ first_name, last_name, email, age, password, cart, role });
                    return done(null, nuevoUsuario);

                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use("local",
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password'
            },
            async (email, password, done) => {
                try {
                    const user = await UsuariosManager.getBy({ email });
                    if (!user) {
                        return done(null, false, { message: 'Incorrect email.' });
                    }
                    if (!bcrypt.compareSync(password, user.password)) {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
                        user.role = "admin";
                    } else {
                        user.role = "user";
                    }
                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    passport.use("github",
        new GitHubStrategy(
            {
                clientID: config.GITHUB.CLIENT_ID_GITHUB,
                clientSecret: config.GITHUB.CLIENT_SECRET_GITHUB,
                callbackURL: config.GITHUB.CALLBACKGITHUB
            },
            async (t1, t2, profile, done) => {
                try {
                    let { name, email, login: username } = profile._json;
                    if (!email || !username) {
                        return done(null, false);
                    }
                    let usuario = await UsuariosManager.getBy({ username });
                    if (!usuario) {
                        let existeMail = await UsuariosManager.getBy({ email });
                        if (!existeMail) {
                            usuario = await UsuariosManager.create({ first_name: name, username, email });
                        }
                    }
                    return done(null, usuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use("current",
        new JwtStrategy(
            {
                secretOrKey: SECRET,
                jwtFromRequest: ExtractJwt.fromExtractors([buscaToken])
            },
            async (usuario, done) => {
                try {
                    console.log(`pasa por passport!`);
                    return done(null, usuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
};