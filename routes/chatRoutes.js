const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/ChatController");

router.post("/send", ChatController.sendMessage);
router.get("/:jobId", ChatController.getMessages);

module.exports = router;
