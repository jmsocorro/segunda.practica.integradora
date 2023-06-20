import { Router } from "express";
import { messageModel } from "../dao/models/messageModel.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const onehourago = new Date( Date.now() - 1000 * 60 * 60 );
        console.log(onehourago)
        // traigo los mensajes de la ultima hora
        const messages = await messageModel.find({ date: { $gt: onehourago } }).lean().exec();
        res.render("chat", { messages });
    } catch (error) {
        console.log("ERROR DE CONEXION: " + error);
    }
});

export default router;
