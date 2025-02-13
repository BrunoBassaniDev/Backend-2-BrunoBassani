import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.get("/product/:id", async (req, res) => {
    try {
        const productId = req.params.id;

        const response = await fetch(`http://localhost:8080/api/products/${productId}`);
        const data = await response.json();

        if (data.status === "error") {
            return res.status(404).send("Producto no encontrado");
        }

        const product = data.payload;

        res.render("productDetail", { title: product.title, product });
    } catch (error) {
        res.status(500).send(`Error al obtener el producto: ${error.message}`);
    }
});

router.get("/cart/:id", async (req, res) => {
    try {
        const cartId = req.params.id;
        const cart = await cartManager.getOneById(cartId);

        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }

        res.render("cart", { title: "Carrito", cart });
    } catch (error) {
        res.status(500).send(`Error al obtener el carrito: ${error.message}`);
    }
});

router.get("/", async (req, res) => {
    try {
        res.render("realTimeProducts", { title: "Inicio" });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

export default router;