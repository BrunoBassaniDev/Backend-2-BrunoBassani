import express from "express";
import dotenv from "dotenv";
import { config as configHandlebars } from "./config/handlebars.config.js";
import { config as configWebsocket } from "./config/websocket.config.js";
import { connectDB } from "./config/mongoose.config.js";
import cookieParser from "cookie-parser";
import { config } from './config/config.js';
import passport from 'passport';
import { iniciarPassport } from './config/passport.config.js';

import sessionsRouter from './routes/sessionsRouter.js';
import routerProducts from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";
import routerViewHome from "./routes/home.view.router.js";
import usersRouter from './routes/usersRouter.js';
import apiUsersRouter from './routes/apiUsersRouter.js';
import passwordRouter from './routes/passwordRouter.js';

dotenv.config();

const app = express();

connectDB();

app.use("/api/public", express.static("./src/public"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser(config.SECRET_SESSION));

configHandlebars(app);

iniciarPassport();
app.use(passport.initialize());

app.use(express.static("./src/public"));

app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts); // Asegúrate de registrar la ruta de carritos
app.use("/", routerViewHome);
app.use("/api/sessions", sessionsRouter);
app.use("/users", usersRouter);
app.use("/api/users", apiUsersRouter);
app.use("/api/password", passwordRouter);

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send('OK');
});

const httpServer = app.listen(config.PORT, () => {
    console.log(`Ejecutándose en http://localhost:${config.PORT}`);
});

configWebsocket(httpServer);