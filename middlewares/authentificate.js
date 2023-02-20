const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const { HttpError } = require("../helpers");

const dotenv = require("dotenv");

dotenv.config();

const { SECRET_KEY} = process.env;

const authentificate = async(req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if(bearer !== "Bearer") {
        next(HttpError(401));
    }
    try {
        const { id } = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);
    if(!user || !user.token || user.token !== token) {
        next(HttpError(401, "User not found"));
    }
    req.user = user;
    next();
    } catch (error) {
        next(HttpError(401, error.message))
    }
}

module.exports = authentificate;