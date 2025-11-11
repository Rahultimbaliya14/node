const express = require("express");
const router = express.Router(); 

// Import authentication middlewares
const { authenticateToken } = require('../middleware/auth');
const { authenticateTokenCertverse } = require("../middleware/certverseAuth");

// Import controllers
const feedback = require("../controller/feedbackController");
const mailer = require("../controller/mailController");
const trainController = require("../controller/trainController");
const pdfController = require("../controller/examController");

// Public routes
router.post("/feedback/create", (req, res) => feedback.create(req, res));
router.post("/mail/send", (req, res) => mailer.sendMail(req, res));

router.get("/train/getTrainInfo/:number", (req, res) => trainController.getTrainInfo(req, res));
router.get("/train/getTrainRouteInfo/:number", (req, res) => trainController.getTrainRoutInfo(req, res));
router.post("/train/getTrainCurrentLocation", (req, res) => trainController.getTrainCurrentLocation(req, res));
router.post("/train/getPNRInfo", (req, res) => trainController.getPNRInfo(req, res));
router.post("/train/getBetweenTrain", (req, res) => trainController.getBetweenTrain(req, res));
// Protected routes
router.get("/feedback/getAll", authenticateToken, (req, res) => feedback.getAll(req, res));
router.delete("/feedback/delete/:id", authenticateToken, (req, res) => feedback.deletedFeedback(req, res));
router.get("/mail/getAll", authenticateToken, (req, res) => mailer.getEmails(req, res));
router.delete("/mail/delete/:id", authenticateToken, (req, res) => mailer.deleteEmail(req, res));

router.get("/exam/getAllExam",authenticateTokenCertverse, (req, res) => pdfController.getAllExam(req, res));
router.post("/exam/createExam", (req, res) => pdfController.createExam(req, res));
router.put("/exam/updateExam/:id", (req, res) => pdfController.updateExam(req, res));
router.delete("/exam/deleteExam/:id", (req, res) => pdfController.deleteExam(req, res));
router.get("/exam/getExamById/:id", (req, res) => pdfController.getExamById(req, res));
router.post("/exam/suggestion", (req, res) => pdfController.postExamSuggestion(req, res));
module.exports = router;