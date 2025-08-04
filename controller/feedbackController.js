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
}
