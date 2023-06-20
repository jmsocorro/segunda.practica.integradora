import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
};
export default __dirname;

export const generateToken = (user) => {
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "24h",
    });
    return token;
};
export const extractCookie = (req) => {
    return req && req.cookies ? req.cookies[process.env.JWT_COOKIE] : null;
};
export const passportAuthenticate = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (error, user, info) {
            if (error) return next(error);
            //console.log(info);
            if (!user)
                return res.status(401).render("login", {
                    message: {
                        type: "error",
                        title: info.title ? info.title : "Error",
                        text: info.text ? info.text : "Iniciá la sesión",
                    },
                });
            req.user = user;
            next();
        })(req, res, next);
    };
};
export const userLogged = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (error, user, info) {
            if (error) return next(error);
            //console.log(info);
            if (user) return res.redirect("products");
            next();
        })(req, res, next);
    };
};
