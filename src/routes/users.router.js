import { Router } from "express";
import passport from "passport";
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
router.post(
    "/login",
    passport.authenticate("login", { failureRedirect: "/failurelogin" }),
    async (req, res) => {
        if (!req.user) {
            res.render("login", {
                message: {
                    type: "error",
                    title: "Error de logueo",
                    text: "El correo eletrónico o contraseña no son correctos",
                },
            });
        } else {
            delete req.user.password;
            delete req.user._id;
            delete req.user.__v;
            req.session.user = req.user;
            res.redirect("/products");
        }
        /*
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
    */
    },
);
router.get("/register", (req, res) => {
    if (req.session.user) {
        res.redirect("/products");
    } else {
        res.render("register", {});
    }
});
router.post(
    "/register",
    passport.authenticate("register", {
        failureRedirect: "failureregister",
    }),
    async (req, res) => {
        res.render("login", {
            message: {
                type: "success",
                title: "Registro exitoso",
                text: "Iniciá tu session con los datos cargados",
            },
        });
    },
);
router.get("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            res.status(500).render("errors", { error: error });
        } else {
            res.redirect("login");
        }
    });
});
router.get("/failureregister", (req, res) => {
    res.render("register", {
        message: {
            type: "error",
            title: "Error de registro",
            text: "El email ya se encuentre registrado",
        },
    });
});
router.get("/failurelogin", (req, res) => {
    res.render("login", {
        message: {
            type: "error",
            title: "Error de logueo",
            text: "El correo eletrónico o contraseña no son correctos",
        },
    });
});
router.get(
    "/githublogin",
    passport.authenticate("github", { scope: ["user:email"] }),
    (req, res) => {},
);
export default router;
