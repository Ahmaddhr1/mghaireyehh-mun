import mongoose from "mongoose";

const recipientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: {
      type: Number,
      default: 0,
      unique: true,
      required: true,
    },
    financialSituation:{
      type:"String",
      enum:["poor","very poor"]
    },
    financialAidCount: {
      type: Number,
      default: 0,
    },
    moralAidCount: {
      type: Number,
      default: 0,
    },
    aids: [
      {
        aid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Aid",
          required: true,
        },
        assignedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Recipient =
  mongoose.models.Recipient || mongoose.model("Recipient", recipientSchema);

export default Recipient;