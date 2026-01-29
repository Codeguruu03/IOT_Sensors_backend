# IoT Sensor Backend

A Node.js backend service for ingesting and retrieving IoT sensor temperature readings.

## Tech Stack

- **Node.js 20 LTS** - Runtime
- **Express.js** - REST API framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **MQTT** - Real-time IoT messaging (Bonus)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Then edit `.env` with your MongoDB Atlas connection string:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/iot_sensors?retryWrites=true&w=majority
```

> **Need MongoDB Atlas?** Sign up for FREE at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) (no credit card required)

### 3. Run the Server

```bash
# Development (with hot-reload)
npm run dev

# Production
npm start
```

## API Endpoints

### POST `/api/sensor/ingest`

Ingest sensor temperature readings.

**Request Body:**
```json
{
  "deviceId": "sensor-01",
  "temperature": 32.1,
  "timestamp": 1705312440000
}
```

> Note: `timestamp` is optional. If not provided, defaults to current time.

**Example (curl):**
```bash
curl -X POST http://localhost:3000/api/sensor/ingest \
  -H "Content-Type: application/json" \
  -d '{"deviceId": "sensor-01", "temperature": 32.1}'
```

**Response (201):**
```json
{
  "_id": "...",
  "deviceId": "sensor-01",
  "temperature": 32.1,
  "timestamp": 1705312440000,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

---

### GET `/api/sensor/:deviceId/latest`

Retrieve the latest reading for a specific device.

**Example (curl):**
```bash
curl http://localhost:3000/api/sensor/sensor-01/latest
```

**Response (200):**
```json
{
  "_id": "...",
  "deviceId": "sensor-01",
  "temperature": 32.1,
  "timestamp": 1705312440000,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

**Response (404):**
```json
{
  "message": "No data found"
}
```

## MQTT Integration (Bonus)

The server automatically subscribes to MQTT topic `iot/sensor/+/temperature` on the public broker `test.mosquitto.org`.

### Simulate a Device

Run the device simulator in a separate terminal:

```bash
node simulateDevice.js
```

This publishes random temperature readings every 5 seconds.

### MQTT Message Format

**Topic:** `iot/sensor/<deviceId>/temperature`

**Payload:**
```json
{
  "temperature": 32.1
}
```

## Project Structure

```
├── src/
│   ├── server.js           # Entry point
│   ├── app.js              # Express configuration
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/
│   │   └── sensor.controller.js
│   ├── models/
│   │   └── Sensor.js       # Mongoose schema
│   ├── mqtt/
│   │   └── subscriber.js   # MQTT subscriber
│   └── routes/
│       └── sensor.routes.js
├── simulateDevice.js       # MQTT device simulator
├── .env                    # Environment variables
└── package.json
```

## Database Schema

| Field       | Type   | Required | Description                    |
|-------------|--------|----------|--------------------------------|
| deviceId    | String | Yes      | Unique device identifier       |
| temperature | Number | Yes      | Temperature reading            |
| timestamp   | Number | Yes      | Epoch milliseconds             |
| createdAt   | Date   | Auto     | Document creation time         |
| updatedAt   | Date   | Auto     | Document last update time      |

## Testing with Postman

1. Import requests to Postman
2. Set base URL: `http://localhost:3000`
3. Test POST `/api/sensor/ingest` with JSON body
4. Test GET `/api/sensor/sensor-01/latest`

## License

ISC
