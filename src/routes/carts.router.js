import { Router } from "express";
import passport from 'passport';
import { authorize } from '../middleware/auth.js';
import { addProductToCart, purchaseCart, getAllCarts, getCartById, createCart, deleteCart, deleteProductFromCart } from '../controllers/CartsController.js';

const router = Router();

router.get("/", getAllCarts);
router.get("/:cid", getCartById);
router.post("/", createCart);
router.put("/:cid/products/:pid", passport.authenticate('jwt', { session: false }), authorize(['user']), addProductToCart);
router.delete("/:id", deleteCart);
router.delete("/:id/products/:pid", deleteProductFromCart);
router.post("/:cid/purchase", passport.authenticate('current', { session: false }), authorize(['user']), purchaseCart);

export default router;