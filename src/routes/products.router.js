import { Router } from "express";
import { ProductManagerDB } from "../dao/ProductManagerDB.js";

const router = Router();
const prod = new ProductManagerDB();

router.use((req, res, next) => {
    if (!req.session.user) {
        res.render("login", {
            message: {
                type: "error",
                title: "Acceso denegado",
                text: "Inicia sesión para ver los productos",
            },
        });
    } else {
        next();
    }
});

router.get("/", async (req, res) => {
    let { limit, page, query, sort } = req.query;
    try {
        const productos = await prod.getProducts(limit, page, query, sort);
        const user = req.session.user;
        res.render("products", {
            productos: productos,
            user: user,
        });
    } catch (err) {
        res.status(400).send(err);
    }
});
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    try {
        const foundprod = await prod.getProductById(id);
        res.render("product", foundprod);
    } catch (error) {
        res.status(404).send({
            error: "Producto no encontrado",
            servererror: error,
        });
    }
});

export default router;
