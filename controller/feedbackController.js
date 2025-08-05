const mongoose = require("mongoose");
const feedback = require('../models/feedback');


exports.create = async (req, res) => {
  try {

    const newFeedback = new feedback(req.body);
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.getAll = async (req, res) => {
  try {
    const feedbacks = await feedback.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletedFeedback = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedFeedback = await feedback.findByIdAndDelete(id);
    if (!deletedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
