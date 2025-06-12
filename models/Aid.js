import mongoose from "mongoose";

const AidSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["financial", "moral"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    recipients: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipient",
    }],
  },
  { timestamps: true }
);

export default mongoose.models.Aid || mongoose.model("Aid", AidSchema);
