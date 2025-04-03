const mongoose = require("mongoose");
const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  country: { type: String, required: true },
  nearby: { type: String, required: true },
  budget: { type: String, required: true },
  poster: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  matches: [{
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    matchedApplication: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    posterPaymentIntentId: { type: String, default: null },
    applicantPaymentIntentId: { type: String, default: null }
  }]
});
module.exports = mongoose.model("Job", JobSchema);
