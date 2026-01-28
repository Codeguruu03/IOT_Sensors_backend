import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true },
    temperature: { type: Number, required: true },
    timestamp: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Sensor", sensorSchema);
