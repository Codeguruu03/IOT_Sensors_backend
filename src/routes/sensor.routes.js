import express from "express";
import {
  ingestSensorData,
  getLatestReading
} from "../controllers/sensor.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     SensorReading:
 *       type: object
 *       required:
 *         - deviceId
 *         - temperature
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *           example: 65a5f8c7b1234567890abcde
 *         deviceId:
 *           type: string
 *           description: Unique identifier for the IoT device
 *           example: sensor-01
 *         temperature:
 *           type: number
 *           description: Temperature reading in Celsius
 *           example: 32.5
 *         timestamp:
 *           type: number
 *           description: Unix timestamp in milliseconds
 *           example: 1705312440000
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Document creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Document update timestamp
 *     IngestRequest:
 *       type: object
 *       required:
 *         - deviceId
 *         - temperature
 *       properties:
 *         deviceId:
 *           type: string
 *           description: Unique identifier for the IoT device
 *           example: sensor-01
 *         temperature:
 *           type: number
 *           description: Temperature reading in Celsius
 *           example: 32.5
 *         timestamp:
 *           type: number
 *           description: Unix timestamp in milliseconds (optional - defaults to current time)
 *           example: 1705312440000
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: deviceId and temperature are required
 */

/**
 * @swagger
 * /api/sensor/ingest:
 *   post:
 *     summary: Ingest sensor temperature reading
 *     description: Accepts temperature readings from IoT devices and stores them in the database
 *     tags: [Sensor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IngestRequest'
 *     responses:
 *       201:
 *         description: Sensor reading created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SensorReading'
 *       400:
 *         description: Validation error - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/ingest", ingestSensorData);

/**
 * @swagger
 * /api/sensor/{deviceId}/latest:
 *   get:
 *     summary: Get latest sensor reading
 *     description: Returns the most recent temperature reading for a specific device
 *     tags: [Sensor]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the IoT device
 *         example: sensor-01
 *     responses:
 *       200:
 *         description: Latest sensor reading
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SensorReading'
 *       404:
 *         description: No data found for the device
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:deviceId/latest", getLatestReading);

export default router;
