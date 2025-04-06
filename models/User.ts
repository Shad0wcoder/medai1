import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    bloodType: { type: String },
    avatar: { type: String, default: "/profile.jpeg" },
    medicalHistory: {
      type: [
        {
          date: { type: Date, default: Date.now },
          symptoms: [String],
          diagnosis: String,
          chat: [
            {
              question: String,
              answer: String,
            },
          ],
        },
      ],
      default: [],
    },
    reports: [
      {
        name: String,
        url: String,
      },
    ],
    password: { type: String, required: true },
  },
  { timestamps: true }
);


export default mongoose.models.User || mongoose.model("User", UserSchema);
