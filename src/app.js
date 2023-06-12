import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

import { Server } from "socket.io";

import apiProductsRouter from "./routes/apiProducts.router.js";
import productsRouter from "./routes/products.router.js";
import apiCartsRouter from "./routes/apiCarts.router.js";
import cartsRouter from "./routes/carts.router.js";
import realTimeProductsRouter from "./routes/realtimeproducts.router.js";
import chatRouter from "./routes/chat.router.js";
import userRouter from "./routes/users.router.js";
import __dirname from "./utils.js";
import initializePassport from "./config/passport.config.js";
import { messageModel } from "./dao/models/messageModel.js";

mongoose.set("strictQuery", false);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(
    session({
        store: MongoStore.create({
            mongoUrl:
                "mongodb+srv://jmsocorro:mongodbJMS73@cluster0.zzswcza.mongodb.net",
            dbName: "ecommerce",
            mongoOptions: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
            ttl: 14 * 24 * 60 * 60,
        }),
        secret: "M3ss!2OZZ",
        resave: true,
        saveUninitialized: true,
    }),
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/", userRouter);
app.use("/api/products", apiProductsRouter);
app.use("/products", productsRouter);
app.use("/api/carts", apiCartsRouter);
app.use("/carts", cartsRouter);
app.use("/chat", chatRouter);
app.use("/realtimeproducts", realTimeProductsRouter);
app.use(express.static(__dirname + "/public"));

try {
    await mongoose.connect(
        "mongodb+srv://jmsocorro:mongodbJMS73@cluster0.zzswcza.mongodb.net/ecommerce",
        {
            serverSelectionTimeoutMS: 5000,
        },
    );
    console.log("DB conected");
    const httpServer = app.listen(8080, () => {
        console.log("Server UP");
    });

    const socketServer = new Server(httpServer);

    socketServer.on("connection", (socketClient) => {
        //const prod = new ProductManager("./src/data/productos.json");
        console.log("User conected");
        socketClient.on("deleteProd", (prodId) => {
            const result = prod.deleteProduct(prodId);
            if (result.error) {
                socketClient.emit("error", result);
            } else {
                socketServer.emit("products", prod.getProducts());
                socketClient.emit("result", "Producto eliminado");
            }
        });
        socketClient.on("addProd", (product) => {
            const producto = JSON.parse(product);
            const result = prod.addProduct(producto);
            if (result.error) {
                socketClient.emit("error", result);
            } else {
                socketServer.emit("products", prod.getProducts());
                socketClient.emit("result", "Producto agregado");
            }
        });
        socketClient.on("newMessage", async (message) => {
            try {
                console.log(message);
                let newMessage = await messageModel.create({
                    user: message.email.value,
                    message: message.message,
                });
                console.log("app", newMessage);
                socketServer.emit("emitMessage", newMessage);
            } catch (error) {
                console.log(error);
                socketClient.emit("error", error);
            }
        });
    });
} catch (error) {
    console.log(error);
}
