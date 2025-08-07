const express = require("express");
const imagecontroller = require("../controller/imageController");

const router = express.Router();
router.post("/removeBackground", (req, res) => imagecontroller.removeBackground(req, res));

module.exports = router;