import express from "express";
import { config as configHandlebars } from "./config/handlebars.config.js";
import { config as configWebsocket } from "./config/websocket.config.js";
import { connectDB } from "./config/mongoose.config.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import fs from 'fs';
import { SECRET } from './utils.js';
import { auth } from './middleware/auth.js';
import passport from 'passport';
import { iniciarPassport } from './config/passport.config.js';

import { router as sessionsRouter } from './routes/sessionsRouter.js';
import routerProducts from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";
import routerViewHome from "./routes/home.view.router.js";
import usersRouter from './routes/usersRouter.js';
import apiUsersRouter from './routes/apiUsersRouter.js';

const app = express();

const PORT = 8080;

connectDB();

app.use("/api/public", express.static("./src/public"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser('your_secret_key'));

configHandlebars(app);

iniciarPassport();
app.use(passport.initialize());

app.use(express.static("./src/public"));

app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);
app.use("/", routerViewHome);
app.use("/api/sessions", sessionsRouter);
app.use("/users", usersRouter);
app.use("/api/users", apiUsersRouter);

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send('OK');
});

const httpServer = app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});

configWebsocket(httpServer);