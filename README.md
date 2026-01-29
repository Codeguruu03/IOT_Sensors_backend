<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20_LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/MQTT-Mosquitto-660066?style=for-the-badge&logo=eclipsemosquitto&logoColor=white" alt="MQTT"/>
</p>

# 🌡️ IoT Sensor Backend

A production-ready Node.js REST API for ingesting and retrieving IoT sensor temperature readings with real-time MQTT support.

## ✨ Features

- **RESTful API** - POST sensor data & GET latest readings
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **MQTT Integration** - Real-time sensor data ingestion via pub/sub
- **Input Validation** - Required field validation with proper error responses
- **Auto Timestamps** - Server-side timestamp generation when not provided

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ or v20 LTS
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (FREE tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/iot-sensor-backend.git
cd iot-sensor-backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string

# Start development server
npm run dev
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/iot_sensors` |

---

## 📡 API Reference

### Base URL
```
http://localhost:3000/api/sensor
```

### Endpoints

#### `POST /ingest` - Ingest Sensor Data

Accepts temperature readings from IoT devices.

**Request Body:**
```json
{
  "deviceId": "sensor-01",
  "temperature": 32.5,
  "timestamp": 1705312440000  // Optional - defaults to current time
}
```

**Response `201 Created`:**
```json
{
  "_id": "65a5f8c7b1234567890abcde",
  "deviceId": "sensor-01",
  "temperature": 32.5,
  "timestamp": 1705312440000,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

**Error `400 Bad Request`:**
```json
{
  "message": "deviceId and temperature are required"
}
```

---

#### `GET /:deviceId/latest` - Get Latest Reading

Returns the most recent reading for a specific device.

**Example:**
```
GET /api/sensor/sensor-01/latest
```

**Response `200 OK`:**
```json
{
  "_id": "65a5f8c7b1234567890abcde",
  "deviceId": "sensor-01",
  "temperature": 32.5,
  "timestamp": 1705312440000,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

**Error `404 Not Found`:**
```json
{
  "message": "No data found"
}
```

---

## 🧪 Testing

### Using cURL

```bash
# POST - Ingest sensor data
curl -X POST http://localhost:3000/api/sensor/ingest \
  -H "Content-Type: application/json" \
  -d '{"deviceId": "sensor-01", "temperature": 32.5}'

# GET - Retrieve latest reading
curl http://localhost:3000/api/sensor/sensor-01/latest
```

### Using PowerShell

```powershell
# POST - Ingest sensor data
Invoke-RestMethod -Uri "http://localhost:3000/api/sensor/ingest" `
  -Method POST -ContentType "application/json" `
  -Body '{"deviceId": "sensor-01", "temperature": 32.5}'

# GET - Retrieve latest reading
Invoke-RestMethod -Uri "http://localhost:3000/api/sensor/sensor-01/latest"
```

---

## 📶 MQTT Integration (Bonus)

The server subscribes to MQTT topics for real-time sensor data ingestion.

**Broker:** `mqtt://test.mosquitto.org`  
**Topic Pattern:** `iot/sensor/<deviceId>/temperature`

### Simulate IoT Device

```bash
node simulateDevice.js
```

This publishes random temperature readings every 5 seconds:

```
Topic: iot/sensor/sensor-01/temperature
Payload: { "temperature": 28.45 }
```

---

## 🏗️ Project Structure

```
├── src/
│   ├── server.js              # Application entry point
│   ├── app.js                 # Express app configuration
│   ├── config/
│   │   └── db.js              # MongoDB connection handler
│   ├── controllers/
│   │   └── sensor.controller.js  # Request handlers
│   ├── models/
│   │   └── Sensor.js          # Mongoose schema
│   ├── mqtt/
│   │   └── subscriber.js      # MQTT client & message handler
│   └── routes/
│       └── sensor.routes.js   # API route definitions
├── simulateDevice.js          # MQTT device simulator
├── .env.example               # Environment template
├── .gitignore
├── package.json
└── README.md
```

---

## 📊 Database Schema

**Collection:** `sensors`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `deviceId` | String | ✅ | Unique identifier for the IoT device |
| `temperature` | Number | ✅ | Temperature reading in °C |
| `timestamp` | Number | ✅ | Unix timestamp (ms) - auto-generated if not provided |
| `createdAt` | Date | Auto | Document creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js 20 LTS** | JavaScript runtime |
| **Express.js 4.x** | Web framework |
| **MongoDB Atlas** | Cloud database |
| **Mongoose 8.x** | MongoDB ODM |
| **MQTT.js 5.x** | MQTT client library |
| **dotenv** | Environment configuration |
| **nodemon** | Development hot-reload |

---

## 📝 Scripts

```bash
npm start      # Production server
npm run dev    # Development with hot-reload
```

---

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- MongoDB Atlas provides built-in authentication and encryption

---

## 📄 License

ISC © 2024

---

<p align="center">
  Built with ❤️ for IoT
</p>
