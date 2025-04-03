const Application = require("../models/Application");
const Job = require("../models/Job");

//Apply to job with a jobId-POST
exports.applyToJob = async (req, res) => {
  try {
    const { jobId, quotedPrice } = req.body;
    // Create the application document
    const application = await Application.create({
      job: jobId,
      applicant: req.userId,
      quotedPrice,
      status: "pending",
    });

    // Find the job and add a match record
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    job.matches.push({
      applicant: req.userId,
      matchedApplication: application._id,
      paymentStatus: "pending"
    });
    await job.save();

    res.json({ message: "Application submitted", application });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Get application by jobId
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId });
    res.json(applications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Get application that current users has applied to(where the current user is applicant)
exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.userId }).populate("job");
    res.json(apps);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete application-on withdraw
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    // Optionally, check if the logged-in user is authorized to delete this application
    if (application.applicant.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized to delete this application" });
    }
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: "Application deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Reject application and set status to rejected
exports.rejectApplication = async (req, res) => {
  try {
    // Find the application by its ID from the URL
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    // Verify that the logged-in user is authorized to reject this application:
    // The current user must be the poster of the job associated with the application.
    const job = await Job.findById(application.job);
    if (!job) {
      return res.status(404).json({ error: "Associated job not found" });
    }
    if (job.poster.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized to reject this application" });
    }
    // Update the status to "rejected" and save the application
    application.status = "rejected";
    await application.save();
    res.json({ message: "Application rejected", application });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Accept application
exports.acceptApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    const job = await Job.findById(application.job);
    if (!job) {
      return res.status(404).json({ error: "Associated job not found" });
    }
    if (job.poster.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized to accept this application" });
    }
    application.status = "accepted";
    await application.save();
    res.json({ message: "Application accepted", application });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
