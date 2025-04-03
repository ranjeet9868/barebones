const ChatMessage = require("../models/ChatMessage");

exports.sendMessage = async (req, res) => {
  try {
    const { job, sender, receiver, message } = req.body;
    const chatMessage = await ChatMessage.create({ job, sender, receiver, message });
    res.json({ message: "Message sent", chatMessage });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ job: req.params.jobId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
