const express = require("express");

const router = express.Router();
const feedback = require("../controller/feedbackController");

router.post("/feedback", (req, res) => feedback.create(req, res));

module.exports = router;
