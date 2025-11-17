const express = require("express");
const router = express.Router(); 

// Import authentication middlewares
const { authenticateToken } = require('../middleware/auth');

// Import controllers
const feedback = require("../controller/feedbackController");
const mailer = require("../controller/mailController");

// Public routes
router.post("/feedback/create", (req, res) => feedback.create(req, res));
router.post("/mail/send", (req, res) => mailer.sendMail(req, res));

// Protected routes
router.get("/feedback/getAll", authenticateToken, (req, res) => feedback.getAll(req, res));
router.delete("/feedback/delete/:id", authenticateToken, (req, res) => feedback.deletedFeedback(req, res));
router.get("/mail/getAll", authenticateToken, (req, res) => mailer.getEmails(req, res));
router.delete("/mail/delete/:id", authenticateToken, (req, res) => mailer.deleteEmail(req, res));

module.exports = router;