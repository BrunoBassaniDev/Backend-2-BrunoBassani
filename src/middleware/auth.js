import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const auth = (req, res, next) => {
    const token = req.signedCookies.currentUser;
    if (!token) {
        return res.redirect('/users/login');
    }
    try {
        const user = jwt.verify(token, config.SECRET);
        req.user = user;
        next();
    } catch (error) {
        res.redirect('/users/login');
    }
};

export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};