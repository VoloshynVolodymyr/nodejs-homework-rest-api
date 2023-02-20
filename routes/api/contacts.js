const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/contacts");

const { authentificate, validateBody, isValidId } = require("../../middlewares");

const { schemas } = require("../../models/contact");

router.get("/", authentificate, ctrl.getAll);

router.get("/:id", authentificate, isValidId, ctrl.getById);

router.post("/", authentificate, validateBody(schemas.addSchema) ,ctrl.add);

router.delete("/:id", authentificate, isValidId, ctrl.deleteById);

router.put("/:id", authentificate, isValidId, validateBody(schemas.addSchema), ctrl.updateById);

router.patch("/:id/favorite", authentificate, isValidId, validateBody(schemas.updateFavoriteSchema) ,ctrl.updateFavorite);

module.exports = router;
