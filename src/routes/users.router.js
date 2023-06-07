import { Router } from "express";
import { UserManagerDB } from "../dao/UserManagerDB.js";

const router = Router();
const user = new UserManagerDB();
router.get("/", (req, res) => {
    if (req.session.user) {
        res.redirect("/products");
    } else {
        res.render("login", {});
    }
});
router.get("/login", (req, res) => {
    if (req.session.user) {
        res.redirect("/products");
    } else {
        res.render("login", {});
    }
});
router.post("/login", async (req, res) => {
    const loguser = req.body;
    if (req.session.user) {
        res.redirect("/products");
    } else if (
        loguser.email === "adminCoder@coder.com" &&
        loguser.password === "adminCod3r123"
    ) {
        req.session.user = {
            first_name: "Admin",
            last_name: "Coder",
            email: loguser.email,
            age: -1,
            role: "admin",
        };
        res.redirect("/products");
    } else {
        try {
            const result = await user.loginUser(loguser);
            if (result.error) {
                res.render("login", {
                    message: {
                        type: "error",
                        title: "Error de logueo",
                        text: result.errortxt,
                    },
                });
            } else {
                delete result.password;
                delete result._id;
                delete result.__v;
                req.session.user = result;
                res.redirect("/products");
            }
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    }
});
router.get("/register", (req, res) => {
    if (req.session.user) {
        res.redirect("/products");
    } else {
        res.render("register", {});
    }
});
router.post("/register", async (req, res) => {
    if (req.session.user) {
        res.redirect("/products");
    } else {
        const newuser = req.body;
        try {
            const result = await user.newUser(newuser);
            if (result.error) {
                res.render("register", {
                    message: {
                        type: "error",
                        title: "Error de registro",
                        text: result.errortxt,
                    },
                });
            } else {
                res.render("login", {
                    message: {
                        type: "success",
                        title: "Registro exitoso",
                        text: "Iniciá tu session con los datos cargados",
                    },
                });
            }
        } catch (err) {
            res.status(400).send(err);
        }
    }
});
router.get("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            res.status(500).render("errors", { error: error });
        } else {
            res.redirect("login");
        }
    });
});

export default router;
