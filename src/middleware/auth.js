import jwt from 'jsonwebtoken';
import { SECRET } from '../utils.js';

export const auth = (req, res, next) => {
    const token = req.signedCookies.currentUser;
    if (!token) {
        return res.redirect('/users/login');
    }
    try {
        const user = jwt.verify(token, SECRET);
        req.user = user;
        next();
    } catch (error) {
        res.redirect('/users/login');
    }
};