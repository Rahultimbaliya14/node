const express = require("express");


const router = express.Router();
const feedback = require("../controller/feedbackController");
const mailer = require("../controller/mailController");


// Feedback routes
router.post("/feedback/create", (req, res) => feedback.create(req, res));
router.get("/feedback/getAll", (req, res) => feedback.getAll(req, res));
router.delete("/feedback/delete/:id", (req, res) => feedback.deletedFeedback(req, res));


// Mail routes
router.post("/mail/send", (req, res) => mailer.sendMail(req, res));
router.get("/mail/getAll", (req, res) => mailer.getEmails(req, res));
router.delete("/mail/delete/:id", (req, res) => mailer.deleteEmail(req, res));

module.exports = router;