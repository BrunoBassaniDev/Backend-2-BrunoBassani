import { Router } from "express";
import passport from 'passport';
import { authorize } from '../middleware/auth.js';
import { createProduct, getProductById, getProducts, updateProduct, deleteProduct } from '../controllers/ProductsController.js';

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", passport.authenticate('current', { session: false }), authorize(['admin']), createProduct);
router.put("/:id", passport.authenticate('current', { session: false }), authorize(['admin']), updateProduct);
router.delete("/:id", passport.authenticate('current', { session: false }), authorize(['admin']), deleteProduct);

export default router;