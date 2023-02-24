const express = require("express");

const ctrl = require("../../controllers/auth");

const { authentificate, validateBody, upload } = require("../../middlewares");

const { schemas } = require("../../models/user");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authentificate, ctrl.getCurrent);

router.post("/logout", authentificate, ctrl.logout);

router.patch("/avatars", authentificate, upload.single("avatar"), ctrl.updateAvatar);

module.exports = router;