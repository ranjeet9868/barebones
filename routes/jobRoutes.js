const express = require("express");
const router = express.Router();
const JobController = require("../controllers/JobController");
const auth = require("../middleware/auth");

// Create a new job
router.post("/", auth, JobController.createJob);

// Get all jobs with their responses in one go
router.get("/myjobs/responses", auth, JobController.getMyJobsWithResponses);

// Get all jobs-to display under joblist
router.get("/", auth, JobController.getAllJobs);

// Route to get applications for a specific job: - show responses for a job
router.get("/:jobId/applications", auth, JobController.getJobApplications);

// Route to get job by id
router.get("/:id", auth, JobController.getJob);

// Route to process payments
router.post("/:id/create-payment-intent", auth, JobController.createPaymentIntent);

module.exports = router;
