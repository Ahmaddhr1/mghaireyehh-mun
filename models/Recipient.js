import mongoose from "mongoose";

const recipientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, },
    phoneNumber: {
      type: Number,
      default: 0,
      unique:true,
      required:true
    },
    financialAidCount: {
      type: Number,
      default: 0,
    },
    moralAidCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Recipient = mongoose.models.Recipient || mongoose.model("Recipient", recipientSchema);
export default Recipient;
