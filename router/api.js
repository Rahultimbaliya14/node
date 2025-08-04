const express = require("express");


const router = express.Router();
const feedback = require("../controller/feedbackController");
const mailer = require("../controller/mailController");


// Feedback routes
router.post("/feedback/create", (req, res) => feedback.create(req, res));
router.get("/feedback/getAll", (req, res) => feedback.getAll(req, res));


// Mail routes
router.post("/mail/send", (req, res) => mailer.sendMail(req, res));

module.exports = router;