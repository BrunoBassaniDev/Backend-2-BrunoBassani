import { CartsRepository } from "../repositories/CartsRepository.js";
import { ProductosRepository } from "../repositories/ProductosRepository.js";
import { TicketsRepository } from "../repositories/TicketsRepository.js";
import { procesaErrores } from "../utils.js";

export const purchaseCart = async (req, res) => {
    const { cid } = req.params;
    if (!isValidObjectId(cid)) {
        return res.status(400).json({ error: "Ingrese un id de cart válido (mongodb object id)" });
    }

    if (req.user.cart != cid) {
        return res.status(400).json({ error: "El cart elegido no pertenece al usuario autenticado" });
    }

    try {
        const cart = await CartsRepository.getCartById(cid);
        const conStock = [];
        const sinStock = [];
        let total = 0;

        for (let i = 0; i < cart.products.length; i++) {
            const producto = await ProductosRepository.getProductoById(cart.products[i].product);
            if (!producto || producto.stock < cart.products[i].quantity) {
                sinStock.push({
                    _id: cart.products[i].product,
                    cantidad: cart.products[i].quantity
                });
            } else {
                conStock.push({
                    _id: cart.products[i].product,
                    cantidad: cart.products[i].quantity,
                    descrip: producto.description,
                    title: producto.title,
                    price: producto.price,
                    subtotal: producto.price * cart.products[i].quantity
                });
                total += producto.price * cart.products[i].quantity;
                producto.stock -= cart.products[i].quantity;
                await ProductosRepository.updateProducto(cart.products[i].product, producto);
            }
        }

        if (conStock.length === 0) {
            return res.status(400).json({ error: "No existen ítems en condiciones de ser adquiridos" });
        }

        const nroComp = Date.now();
        const fecha = new Date();
        const detalle = conStock;
        const comprador = req.user.email;

        const ticket = await TicketsRepository.createTicket({
            nroComp,
            fecha,
            detalle,
            total,
            comprador
        });

        cart.products = sinStock;
        await CartsRepository.updateCart(cid, cart);

        res.status(200).json({
            payload: "Compra realizada con éxito",
            ticket
        });
    } catch (error) {
        procesaErrores(res, error);
    }
};