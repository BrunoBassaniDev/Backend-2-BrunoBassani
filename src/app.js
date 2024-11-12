import express from "express";
import routerCarts from "./routes/Carts.router.js";
import routerProducts from "./routes/Products.router.js";

const app = express();

const PORT = 8080;

app.use("/api/public", express.static("./src/public"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api/Carts", routerCarts);
app.use("/api/Products", routerProducts);

app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});