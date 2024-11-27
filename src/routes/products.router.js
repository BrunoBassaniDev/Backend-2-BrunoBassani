import { Router } from "express";

import ProductManager from "../managers/ProductManager.js";
import uploader from "../utils/uploader.js";

const router = Router();
const productManager = new ProductManager;

router.get("/", async (req, res)=>{
    try {
        const products= await productManager.getAll(req.query);
        res.status(200).json({ status: "succes", payload: products });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });

    }
});

router.get("/:id", async (req, res)=>{
    try {
        const product= await productManager.getOneById(req.params.id);
        res.status(200).json({ status: "succes", payload: product });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

router.post("/", uploader.single("thumbnail"), async (req, res)=>{
    try {
        console.log("File recibido:", req.file);
        console.log("Body recibido:", req.body);
        const product= await productManager.insertOne(req.body, req.file);
        res.status(201).json({ status: "succes", payload: product });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

router.put("/:id", uploader.single("thumbnail"), async (req, res)=>{
    try {
        const product= await productManager.updateOneById(req.params?.id, req.body, req.file);
        res.status(200).json({ status: "succes", payload: product });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

router.delete("/:id", async (req, res)=>{
    try {
        await productManager.deleteOneById(req.params?.id);
        res.status(200).json({ status: "succes" });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

export default router;