const express = require("express");
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const feedback = require("../controller/feedbackController");
const mailer = require("../controller/mailController");
const trainController = require("../controller/trainController");

// Public routes
router.post("/feedback/create", (req, res) => feedback.create(req, res));
router.post("/mail/send", (req, res) => mailer.sendMail(req, res));

router.get("/train/getTrainInfo/:number", (req, res) => trainController.getTrainInfo(req, res));
router.get("/train/getTrainRouteInfo/:number", (req, res) => trainController.getTrainRoutInfo(req, res));
// Protected routes
router.get("/feedback/getAll", authenticateToken, (req, res) => feedback.getAll(req, res));
router.delete("/feedback/delete/:id", authenticateToken, (req, res) => feedback.deletedFeedback(req, res));
router.get("/mail/getAll", authenticateToken, (req, res) => mailer.getEmails(req, res));
router.delete("/mail/delete/:id", authenticateToken, (req, res) => mailer.deleteEmail(req, res));
module.exports = router;