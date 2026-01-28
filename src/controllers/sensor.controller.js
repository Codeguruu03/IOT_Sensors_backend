import Sensor from "../models/Sensor.js";

export const ingestSensorData = async (req, res) => {
  try {
    const { deviceId, temperature, timestamp } = req.body;

    if (!deviceId || temperature === undefined) {
      return res.status(400).json({ message: "deviceId and temperature are required" });
    }

    const sensor = await Sensor.create({
      deviceId,
      temperature,
      timestamp: timestamp || Date.now()
    });

    res.status(201).json(sensor);
  } catch (err) {
    console.error("Error ingesting sensor data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLatestReading = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const data = await Sensor.findOne({ deviceId }).sort({ timestamp: -1 });

    if (!data) {
      return res.status(404).json({ message: "No data found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching latest reading:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
