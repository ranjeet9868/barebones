const express = require("express");
const router = express.Router();
const ApplicationController = require("../controllers/ApplicationController");
const auth = require("../middleware/auth");

router.post("/apply", auth, ApplicationController.applyToJob);
router.get("/", auth, ApplicationController.getMyApplications);
router.get("/:jobId", auth, ApplicationController.getApplications);

// Reject application
router.put("/:id/reject", auth, ApplicationController.rejectApplication);

// Accept application
router.put("/:id/accept", auth, ApplicationController.acceptApplication);

// DELETE route to withdraw an application:
router.delete("/:id", auth, ApplicationController.deleteApplication);

module.exports = router;
