const Job = require("../models/Job");
const Application = require("../models/Application");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


//Post(create) a job
exports.createJob = async (req, res) => {
  // console.log("User ID:", req.userId); // For debugging only!
  try {
    const { title, description, city, province, country, nearby, budget, schedule } = req.body;
    const job = await Job.create({ title, description, city, province, country, nearby, budget, schedule, poster: req.userId });
    res.json({ message: "Job created", job });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Get job by id
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Get jobs with responses-(All jobs with responses in one go on a single page)
exports.getMyJobsWithResponses = async (req, res) => {
  // console.log("Reached /myjobs/responses") // For debugging only!
  try {
    // Find jobs posted by the logged-in user
    const jobs = await Job.find({ poster: req.userId });
    // Enrich each job with its non-rejected applications
    const enrichedJobs = [];
    for (const job of jobs) {
      const apps = await Application.find({ job: job._id, status: { $ne: "rejected" } });
      const jobObj = job.toObject(); // convert Mongoose document to plain JS object
      jobObj.responses = apps;
      enrichedJobs.push(jobObj);
    }
    res.json(enrichedJobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get applications for a job(Responses) to show under my responses-Drill down
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applications = await Application.find({ job: jobId });
    res.json(applications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// POST /jobs/:id/pay-applicant : For applicant and poster payment processing
exports.createPaymentIntent = async (req, res) => {
  const { applicationId, role } = req.body; // role should be "poster" or "applicant"
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100,        // 100 cents = $1 CAD
      currency: "cad",
      capture_method: "manual"
    });
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    const matchIndex = job.matches.findIndex(
      m => m.matchedApplication.toString() === applicationId
    );
    if (matchIndex === -1) {
      return res.status(404).json({ error: "Match not found" });
    }
    if (role === "poster") {
      job.matches[matchIndex].posterPaymentIntentId = paymentIntent.id;
    } else if (role === "applicant") {
      job.matches[matchIndex].applicantPaymentIntentId = paymentIntent.id;
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }
    await job.save();
    res.json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} PaymentIntent created`,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

