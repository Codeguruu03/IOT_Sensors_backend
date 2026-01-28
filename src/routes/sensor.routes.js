import express from "express";
import {
  ingestSensorData,
  getLatestReading
} from "../controllers/sensor.controller.js";

const router = express.Router();

router.post("/ingest", ingestSensorData);
router.get("/:deviceId/latest", getLatestReading);

export default router;
