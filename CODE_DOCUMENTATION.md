# 📖 IoT Sensor Backend - Complete Code Documentation

This document provides a comprehensive, line-by-line explanation of every file in the IoT Sensor Backend project. It is designed to help developers understand the purpose, functionality, and role of each component in the system.

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [File: package.json](#file-packagejson)
4. [File: src/server.js](#file-srcserverjs)
5. [File: src/app.js](#file-srcappjs)
6. [File: src/config/db.js](#file-srcconfigdbjs)
7. [File: src/config/swagger.js](#file-srcconfigswaggerjs) ⭐ NEW
8. [File: src/models/Sensor.js](#file-srcmodelssensorjs)
9. [File: src/controllers/sensor.controller.js](#file-srccontrollerssensorcontrollerjs)
10. [File: src/routes/sensor.routes.js](#file-srcroutessensorroutesjs)
11. [File: src/mqtt/subscriber.js](#file-srcmqttsubscriberjs)
12. [File: simulateDevice.js](#file-simulatedevicejs)
13. [Data Flow Diagram](#data-flow-diagram)
14. [Error Handling Strategy](#error-handling-strategy)
15. [Environment Variables](#environment-variables)

---

## Project Overview

The IoT Sensor Backend is a **Node.js REST API** designed to:

1. **Ingest** temperature readings from IoT sensors
2. **Store** the data in MongoDB Atlas (cloud database)
3. **Retrieve** the latest reading for any device
4. **Subscribe** to MQTT topics for real-time sensor data (bonus feature)

### Key Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20 LTS | JavaScript runtime environment |
| Express.js | 4.19.2 | Web framework for REST APIs |
| MongoDB | Atlas | Cloud-hosted NoSQL database |
| Mongoose | 8.0.3 | ODM (Object Document Mapper) for MongoDB |
| MQTT.js | 5.4.0 | MQTT protocol client library |
| Swagger UI | 5.x | Interactive API documentation |
| dotenv | 16.4.1 | Environment variable management |
| nodemon | 3.0.3 | Development hot-reload utility |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           IoT Sensor Backend                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐         ┌─────────────────┐         ┌───────────────┐ │
│  │   IoT Devices   │         │   MQTT Broker   │         │  HTTP Client  │ │
│  │   (Sensors)     │         │  (Mosquitto)    │         │ (Postman/curl)│ │
│  └────────┬────────┘         └────────┬────────┘         └───────┬───────┘ │
│           │                           │                          │         │
│           │ MQTT Publish              │ MQTT Subscribe           │ HTTP    │
│           ▼                           ▼                          ▼         │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │                         Node.js Application                            ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────────┐  ││
│  │  │ MQTT         │  │  Express     │  │       Controllers            │  ││
│  │  │ Subscriber   │  │  Router      │  │  ┌────────────────────────┐  │  ││
│  │  │              │  │              │  │  │ ingestSensorData()     │  │  ││
│  │  │ subscriber.js│──│sensor.routes │──│  │ getLatestReading()     │  │  ││
│  │  │              │  │    .js       │  │  └────────────────────────┘  │  ││
│  │  └──────┬───────┘  └──────────────┘  └──────────────┬───────────────┘  ││
│  │         │                                           │                   ││
│  │         │              ┌────────────────────────────┘                   ││
│  │         │              │                                                ││
│  │         ▼              ▼                                                ││
│  │  ┌────────────────────────────────┐                                     ││
│  │  │        Mongoose Model          │                                     ││
│  │  │         (Sensor.js)            │                                     ││
│  │  └────────────────┬───────────────┘                                     ││
│  │                   │                                                     ││
│  └───────────────────┼─────────────────────────────────────────────────────┘│
│                      │                                                      │
│                      ▼                                                      │
│           ┌─────────────────────┐                                           │
│           │   MongoDB Atlas     │                                           │
│           │   (Cloud Database)  │                                           │
│           └─────────────────────┘                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## File: package.json

**Location:** `./package.json`  
**Purpose:** Project configuration file that defines metadata, scripts, and dependencies.

```json
{
  "name": "iot-sensor-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "mongoose": "^8.0.3",
    "dotenv": "^16.4.1",
    "mqtt": "^5.4.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.3"
  }
}
```

### Line-by-Line Explanation

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `{` | Opens the JSON object that contains all package configuration |
| 2 | `"name": "iot-sensor-backend"` | **Package Name**: Unique identifier for this project. Used when publishing to npm registry. Follows npm naming conventions (lowercase, hyphens allowed). |
| 3 | `"version": "1.0.0"` | **Semantic Version**: Major.Minor.Patch format. `1.0.0` indicates first stable release. Major = breaking changes, Minor = new features, Patch = bug fixes. |
| 4 | `"type": "module"` | **Module System**: Enables ES Modules (ESM) syntax (`import/export`) instead of CommonJS (`require/module.exports`). This is the modern JavaScript standard. |
| 5 | `"main": "src/server.js"` | **Entry Point**: Specifies which file runs when someone imports this package or runs `node .` in the project directory. |
| 6 | `"scripts": {` | **NPM Scripts**: Custom commands that can be run with `npm run <script-name>`. |
| 7 | `"start": "node src/server.js"` | **Production Script**: Runs `npm start` to start the server with Node.js directly. Used in production environments. |
| 8 | `"dev": "nodemon src/server.js"` | **Development Script**: Runs `npm run dev` to start with nodemon, which automatically restarts the server when files change. |
| 9 | `},` | Closes the scripts object |
| 10 | `"dependencies": {` | **Production Dependencies**: Packages required for the application to run in production. |
| 11 | `"express": "^4.19.2"` | **Express.js**: Fast, minimalist web framework for Node.js. The `^` means compatible with version 4.19.2 and above (but less than 5.0.0). |
| 12 | `"mongoose": "^8.0.3"` | **Mongoose**: Elegant MongoDB object modeling for Node.js. Provides schema validation, middleware, and query building. |
| 13 | `"dotenv": "^16.4.1"` | **dotenv**: Loads environment variables from `.env` file into `process.env`. Keeps sensitive data out of code. |
| 14 | `"mqtt": "^5.4.0"` | **MQTT.js**: Client library for MQTT protocol, enabling pub/sub messaging for IoT devices. |
| 15 | `},` | Closes dependencies object |
| 16 | `"devDependencies": {` | **Development Dependencies**: Packages only needed during development, not in production. |
| 17 | `"nodemon": "^3.0.3"` | **nodemon**: Utility that monitors for file changes and automatically restarts the server. Speeds up development workflow. |
| 18 | `}` | Closes devDependencies object |
| 19 | `}` | Closes the entire package.json object |

### Key Concepts

#### ES Modules vs CommonJS

| Feature | ES Modules (ESM) | CommonJS (CJS) |
|---------|------------------|----------------|
| Import syntax | `import x from 'y'` | `const x = require('y')` |
| Export syntax | `export default x` | `module.exports = x` |
| File extension | `.js` or `.mjs` | `.js` or `.cjs` |
| Loading | Asynchronous | Synchronous |
| Top-level await | ✅ Supported | ❌ Not supported |

---

## File: src/server.js

**Location:** `./src/server.js`  
**Purpose:** Application entry point - bootstraps the server, connects to database, and starts listening for requests.

```javascript
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import "./mqtt/subscriber.js"; // bonus (safe if broker unavailable)

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Line-by-Line Explanation

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import dotenv from "dotenv";` | **Import dotenv package**: ES Module import statement that brings in the dotenv library. This library loads environment variables from a `.env` file. |
| 2 | `dotenv.config();` | **Initialize dotenv**: Reads the `.env` file in the project root and loads all key-value pairs into `process.env`. This MUST be called before any code that uses environment variables. |
| 3 | *(empty line)* | Blank line for readability |
| 4 | `import app from "./app.js";` | **Import Express App**: Imports the configured Express application from `app.js`. The `./` indicates a relative path from the current file. |
| 5 | `import connectDB from "./config/db.js";` | **Import Database Connection**: Imports the MongoDB connection function. This keeps database logic separated from server initialization. |
| 6 | `import "./mqtt/subscriber.js";` | **Import MQTT Subscriber**: Side-effect import that initializes the MQTT subscriber. The subscriber starts automatically when this file is imported. Even if the MQTT broker is unavailable, the server continues to work (graceful degradation). |
| 7 | *(empty line)* | Blank line for readability |
| 8 | `connectDB();` | **Connect to MongoDB**: Calls the async function that establishes a connection to MongoDB Atlas. This uses the `MONGO_URI` environment variable set by dotenv. |
| 9 | *(empty line)* | Blank line for readability |
| 10 | `const PORT = process.env.PORT \|\| 3000;` | **Port Configuration**: Gets the port number from environment variables, or defaults to 3000 if not set. The `\|\|` operator provides a fallback value. |
| 11 | `app.listen(PORT, () => console.log(\`Server running on port ${PORT}\`));` | **Start HTTP Server**: Binds the Express app to the specified port and begins listening for HTTP requests. The callback function runs once the server is ready, logging a confirmation message. |

### Execution Order

```
1. Load dotenv → Read .env file
2. Import app.js → Configure Express
3. Import db.js → Get connection function
4. Import subscriber.js → Start MQTT client
5. connectDB() → Connect to MongoDB
6. app.listen() → Start HTTP server
```

### Why Order Matters

The order of imports and function calls is critical:

1. **dotenv MUST be first**: Environment variables must be loaded before any code tries to access `process.env.MONGO_URI` or `process.env.PORT`
2. **Database before server**: We want to ensure MongoDB is connected before accepting HTTP requests
3. **MQTT is optional**: Imported but doesn't block server startup

---

## File: src/app.js

**Location:** `./src/app.js`  
**Purpose:** Express application configuration - middleware setup, Swagger UI, and route mounting.

```javascript
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import sensorRoutes from "./routes/sensor.routes.js";

const app = express();
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/sensor", sensorRoutes);

export default app;
```

### Line-by-Line Explanation

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import express from "express";` | **Import Express**: Brings in the Express.js framework. Express is a minimal and flexible Node.js web application framework that provides features for web and mobile applications. |
| 2 | `import swaggerUi from "swagger-ui-express";` | **Import Swagger UI**: Middleware that serves auto-generated swagger-ui API documentation. Provides a beautiful interactive interface for testing APIs. |
| 3 | `import swaggerSpec from "./config/swagger.js";` | **Import Swagger Spec**: Imports the OpenAPI specification object that defines all API endpoints, schemas, and documentation. |
| 4 | `import sensorRoutes from "./routes/sensor.routes.js";` | **Import Routes**: Imports the router that handles all `/api/sensor/*` endpoints. Keeping routes in separate files improves code organization. |
| 5 | *(empty line)* | Blank line for readability |
| 6 | `const app = express();` | **Create Express Instance**: Calls the `express()` factory function to create a new Express application. This `app` object has methods for routing HTTP requests, configuring middleware, and more. |
| 7 | `app.use(express.json());` | **JSON Body Parser Middleware**: Built-in Express middleware that parses incoming JSON payloads. Without this, `req.body` would be undefined for POST requests with JSON data. Sets `Content-Type: application/json` parsing. |
| 8 | *(empty line)* | Blank line for readability |
| 9 | `// Swagger UI` | **Comment**: Marks the beginning of Swagger UI configuration. |
| 10 | `app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));` | **Mount Swagger UI**: Attaches the Swagger UI at `/api-docs`. `swaggerUi.serve` serves the static Swagger UI assets, and `swaggerUi.setup(swaggerSpec)` configures it with our API specification. |
| 11 | *(empty line)* | Blank line for readability |
| 12 | `app.use("/api/sensor", sensorRoutes);` | **Mount Router**: Attaches the sensor router at the `/api/sensor` path prefix. All routes defined in `sensorRoutes` will be prefixed with `/api/sensor`. For example, if the router has `/ingest`, the full path becomes `/api/sensor/ingest`. |
| 13 | *(empty line)* | Blank line for readability |
| 14 | `export default app;` | **Export App**: Makes the configured Express app available for import by other modules (specifically `server.js`). The `default` keyword means this is the main export of the module. |

### Middleware Explained

```
Request → express.json() → Router → Controller → Response
            ↓
    Parses JSON body
    and populates req.body
```

**What `express.json()` does:**

```javascript
// Without express.json()
req.body = undefined

// With express.json()
// For request with body: {"deviceId": "sensor-01", "temperature": 25.5}
req.body = { deviceId: "sensor-01", temperature: 25.5 }
```

### Route Mounting Concept

```
app.use("/api/sensor", sensorRoutes);
         ↓
    Base Path: /api/sensor
    
Router defines:
  - POST /ingest      → becomes → POST /api/sensor/ingest
  - GET /:id/latest   → becomes → GET /api/sensor/:id/latest

Swagger UI:
  - /api-docs         → Interactive API documentation
```

---

## File: src/config/swagger.js

**Location:** `./src/config/swagger.js`  
**Purpose:** Swagger/OpenAPI configuration - defines API documentation specification.

```javascript
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IoT Sensor Backend API",
      version: "1.0.0",
      description: "A Node.js REST API for ingesting and retrieving IoT sensor temperature readings with real-time MQTT support.",
      contact: {
        name: "Developer",
        email: "namananilgoyal@gmail.com"
      }
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server"
      }
    ],
    tags: [
      {
        name: "Sensor",
        description: "Sensor data operations"
      }
    ]
  },
  apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
```

### Line-by-Line Explanation

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import swaggerJsdoc from "swagger-jsdoc";` | **Import swagger-jsdoc**: Library that generates OpenAPI specification from JSDoc comments in code files. |
| 3 | `const options = {` | **Configuration Object**: Defines settings for generating the OpenAPI spec. |
| 4 | `definition: {` | **API Definition**: Contains the base OpenAPI specification that will be merged with annotations from code. |
| 5 | `openapi: "3.0.0",` | **OpenAPI Version**: Specifies we're using OpenAPI Specification version 3.0.0 (the current standard). |
| 6-13 | `info: {...}` | **API Metadata**: Contains title, version, description, and contact information displayed in Swagger UI header. |
| 14-19 | `servers: [...]` | **Server List**: Defines available server URLs. Swagger UI uses this for the "Try it out" feature to know where to send requests. |
| 20-25 | `tags: [...]` | **Tag Definitions**: Groups related endpoints together. The "Sensor" tag groups all sensor-related operations. |
| 27 | `apis: ["./src/routes/*.js"]` | **Source Files**: Glob pattern specifying which files contain JSDoc/OpenAPI annotations to parse. Scans all .js files in routes folder. |
| 30 | `const swaggerSpec = swaggerJsdoc(options);` | **Generate Spec**: Calls swagger-jsdoc with options to generate the complete OpenAPI specification object by merging base definition with annotations found in route files. |
| 32 | `export default swaggerSpec;` | **Export Spec**: Makes the generated specification available for use by swagger-ui-express. |

### OpenAPI Concepts

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenAPI Specification                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  info:          → API title, version, description           │
│  servers:       → Where the API is hosted                   │
│  tags:          → Grouping for endpoints                    │
│  paths:         → All API endpoints (from JSDoc)            │
│  components:    → Reusable schemas, responses               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### How swagger-jsdoc Works

```
1. Read options.definition (base spec)
2. Scan files matching options.apis pattern
3. Parse JSDoc comments with @swagger/@openapi tags
4. Merge annotations into complete OpenAPI spec
5. Return the combined specification object
```

---

## File: src/config/db.js

**Location:** `./src/config/db.js`  
**Purpose:** Database connection module - establishes and manages MongoDB connection.

```javascript
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection failed", err);
    process.exit(1);
  }
};

export default connectDB;
```

### Line-by-Line Explanation

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import mongoose from "mongoose";` | **Import Mongoose**: Mongoose is an Object Document Mapper (ODM) that provides a schema-based solution for modeling MongoDB data. It handles validation, casting, and business logic. |
| 2 | *(empty line)* | Blank line for readability |
| 3 | `const connectDB = async () => {` | **Async Function Declaration**: Defines an asynchronous arrow function named `connectDB`. The `async` keyword enables the use of `await` inside the function for handling promises. |
| 4 | `try {` | **Try Block Start**: Opens a try-catch block for error handling. Any errors thrown inside `try` will be caught by the `catch` block. |
| 5 | `await mongoose.connect(process.env.MONGO_URI);` | **Connect to MongoDB**: Asynchronously connects to MongoDB using the connection string from environment variables. `await` pauses execution until the connection is established or fails. The connection string contains: protocol, username, password, host, database name. |
| 6 | `console.log("MongoDB connected");` | **Success Log**: Prints confirmation message when connection succeeds. This helps developers know the database is ready. |
| 7 | `} catch (err) {` | **Catch Block**: Catches any errors from the try block. The `err` parameter contains the error object with details about what went wrong. |
| 8 | `console.error("DB connection failed", err);` | **Error Log**: Prints error message and the error object to the console using `console.error` (outputs to stderr instead of stdout). |
| 9 | `process.exit(1);` | **Exit Process**: Terminates the Node.js process with exit code 1 (indicates error). Without a database, the API cannot function, so we fail fast. Exit code 0 = success, non-zero = error. |
| 10 | `}` | Closes catch block |
| 11 | `};` | Closes the function |
| 12 | *(empty line)* | Blank line for readability |
| 13 | `export default connectDB;` | **Export Function**: Makes `connectDB` available for import. Called from `server.js` during application startup. |

### MongoDB Connection String Breakdown

```
mongodb+srv://username:password@cluster.mongodb.net/database?options

├── mongodb+srv://     → Protocol (SRV for Atlas)
├── username:password  → Authentication credentials
├── @cluster.mongodb.net  → Atlas cluster hostname
├── /database          → Database name (e.g., iot_sensors)
└── ?options           → Connection options (retryWrites, w=majority)
```

### Why Exit on Database Failure?

```
Database Unavailable
        ↓
    Server Starts Anyway?
        ↓
    All API Calls Fail
        ↓
    Users Get 500 Errors
        ↓
    Bad User Experience
        
BETTER: Fail Fast!
        ↓
    process.exit(1)
        ↓
    Deployment System Detects Failure
        ↓
    Alerts Developers
        ↓
    Quick Resolution
```

---

## File: src/models/Sensor.js

**Location:** `./src/models/Sensor.js`  
**Purpose:** Mongoose schema and model definition for sensor data.

```javascript
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
```

### Line-by-Line Explanation

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import mongoose from "mongoose";` | **Import Mongoose**: Brings in Mongoose library for schema definition and model creation. |
| 2 | *(empty line)* | Blank line for readability |
| 3 | `const sensorSchema = new mongoose.Schema(` | **Create Schema**: Instantiates a new Mongoose Schema object. A schema defines the structure, validation rules, and default values for documents in a MongoDB collection. |
| 4 | `{` | Opens the schema definition object |
| 5 | `deviceId: { type: String, required: true },` | **deviceId Field**: Defines a field with type String that is required. If a document is saved without deviceId, Mongoose throws a validation error. String type accepts any text value. |
| 6 | `temperature: { type: Number, required: true },` | **temperature Field**: Numeric field for temperature value. Number type accepts integers and decimals. Required validation ensures every reading has a temperature. |
| 7 | `timestamp: { type: Number, required: true }` | **timestamp Field**: Stores Unix timestamp in milliseconds as a Number. Using Number instead of Date for epoch timestamps provides easier sorting and comparison. |
| 8 | `},` | Closes the schema definition object |
| 9 | `{ timestamps: true }` | **Schema Options**: Enables automatic `createdAt` and `updatedAt` fields. Mongoose automatically manages these - `createdAt` is set once when document is created, `updatedAt` is updated on every save. |
| 10 | `);` | Closes the Schema constructor call |
| 11 | *(empty line)* | Blank line for readability |
| 12 | `export default mongoose.model("Sensor", sensorSchema);` | **Create and Export Model**: `mongoose.model()` compiles the schema into a Model. First argument "Sensor" becomes the collection name (pluralized to "sensors" in MongoDB). The model provides an interface for CRUD operations. |

### Schema Field Options

| Option | Type | Description |
|--------|------|-------------|
| `type` | Constructor | Data type (String, Number, Date, Boolean, ObjectId, Array) |
| `required` | Boolean | Field must be present |
| `default` | Any | Default value if not provided |
| `unique` | Boolean | Creates unique index |
| `min/max` | Number | Minimum/maximum value for numbers |
| `enum` | Array | Allowed values |
| `validate` | Function | Custom validation logic |

### Document Structure

```javascript
// What gets stored in MongoDB:
{
  "_id": ObjectId("65a5f8c7b1234567890abcde"),  // Auto-generated
  "deviceId": "sensor-01",                       // From input
  "temperature": 32.5,                           // From input
  "timestamp": 1705312440000,                    // From input or auto
  "createdAt": ISODate("2024-01-15T10:00:00Z"), // Auto (timestamps: true)
  "updatedAt": ISODate("2024-01-15T10:00:00Z"), // Auto (timestamps: true)
  "__v": 0                                       // Version key
}
```

---

## File: src/controllers/sensor.controller.js

**Location:** `./src/controllers/sensor.controller.js`  
**Purpose:** Request handlers containing business logic for sensor operations.

```javascript
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
```

### Function 1: ingestSensorData

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import Sensor from "../models/Sensor.js";` | **Import Model**: Imports the Sensor model to interact with the sensors collection in MongoDB. |
| 3 | `export const ingestSensorData = async (req, res) => {` | **Export Async Handler**: Named export of an async Express route handler. Takes `req` (request) and `res` (response) objects. `async` allows using `await` for database operations. |
| 4 | `try {` | **Try Block**: Wraps all logic in try-catch for centralized error handling. Any thrown error jumps to catch block. |
| 5 | `const { deviceId, temperature, timestamp } = req.body;` | **Destructure Request Body**: Extracts `deviceId`, `temperature`, and `timestamp` from the JSON request body. Object destructuring is cleaner than `req.body.deviceId`, etc. |
| 7-9 | `if (!deviceId \|\| temperature === undefined) {...}` | **Input Validation**: Checks if required fields are missing. Uses `=== undefined` for temperature because `0` is a valid number but is falsy. Returns 400 Bad Request with descriptive message if validation fails. |
| 11-15 | `const sensor = await Sensor.create({...});` | **Create Document**: `Sensor.create()` is a Mongoose shortcut for `new Sensor().save()`. Creates a new document in the database. Uses shorthand property syntax (`deviceId` instead of `deviceId: deviceId`). The `timestamp \|\| Date.now()` provides default timestamp if not provided. |
| 17 | `res.status(201).json(sensor);` | **Success Response**: Returns HTTP 201 Created status with the created document as JSON. 201 indicates a new resource was successfully created. |
| 18-21 | `} catch (err) {...}` | **Error Handler**: Catches any errors (database failures, validation errors). Logs error for debugging and returns 500 Internal Server Error to client. |

### Function 2: getLatestReading

| Line | Code | Explanation |
|------|------|-------------|
| 24 | `export const getLatestReading = async (req, res) => {` | **Export Async Handler**: Another named export for the GET endpoint. |
| 26 | `const { deviceId } = req.params;` | **Extract URL Parameter**: Gets `deviceId` from the URL path. For `/api/sensor/sensor-01/latest`, `deviceId` would be `"sensor-01"`. |
| 28 | `const data = await Sensor.findOne({ deviceId }).sort({ timestamp: -1 });` | **Query Database**: `findOne()` returns a single document matching the filter. `.sort({ timestamp: -1 })` sorts by timestamp in descending order (newest first). Combined, this finds the most recent reading for the specified device. |
| 30-32 | `if (!data) {...}` | **Not Found Check**: If no document matches, returns 404 Not Found. This happens when the deviceId doesn't exist in the database. |
| 34 | `res.json(data);` | **Success Response**: Returns the document as JSON. `res.json()` automatically sets `Content-Type: application/json` and uses 200 OK status by default. |
| 35-38 | `} catch (err) {...}` | **Error Handler**: Same pattern as ingestSensorData - log and return 500. |

### HTTP Status Codes Used

| Code | Name | When Used |
|------|------|-----------|
| 200 | OK | GET request successful |
| 201 | Created | POST successfully created resource |
| 400 | Bad Request | Client sent invalid data |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server-side error |

---

## File: src/routes/sensor.routes.js

**Location:** `./src/routes/sensor.routes.js`  
**Purpose:** Route definitions mapping URLs to controller functions.

```javascript
import express from "express";
import {
  ingestSensorData,
  getLatestReading
} from "../controllers/sensor.controller.js";

const router = express.Router();

router.post("/ingest", ingestSensorData);
router.get("/:deviceId/latest", getLatestReading);

export default router;
```

### Line-by-Line Explanation

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import express from "express";` | **Import Express**: Needed to create a Router instance. |
| 2-5 | `import { ingestSensorData, getLatestReading } from "...";` | **Named Imports**: Uses destructuring to import specific functions from the controller. Named imports require curly braces and exact function names. |
| 7 | `const router = express.Router();` | **Create Router**: `express.Router()` creates a mini-application capable of handling requests. Routers help organize routes into separate modules. |
| 9 | `router.post("/ingest", ingestSensorData);` | **POST Route**: Maps HTTP POST requests to `/ingest` to the `ingestSensorData` handler. Full path becomes `/api/sensor/ingest` when mounted. The handler is passed as a reference, not called (`ingestSensorData` not `ingestSensorData()`). |
| 10 | `router.get("/:deviceId/latest", getLatestReading);` | **GET Route with Parameter**: Maps GET requests to `/:deviceId/latest`. The `:deviceId` is a route parameter - a placeholder that captures the value from the URL. For `/api/sensor/sensor-01/latest`, `req.params.deviceId` equals `"sensor-01"`. |
| 12 | `export default router;` | **Export Router**: Makes the router available for mounting in `app.js`. |

### Route Parameters Explained

```
Route:    /:deviceId/latest
URL:      /api/sensor/sensor-01/latest
                      ↓
          req.params.deviceId = "sensor-01"

Route:    /:deviceId/latest
URL:      /api/sensor/temp-sensor-xyz/latest
                      ↓
          req.params.deviceId = "temp-sensor-xyz"
```

### Complete Route Table

| Method | Route Pattern | Full Path | Handler | Description |
|--------|--------------|-----------|---------|-------------|
| POST | `/ingest` | `/api/sensor/ingest` | ingestSensorData | Create sensor reading |
| GET | `/:deviceId/latest` | `/api/sensor/:deviceId/latest` | getLatestReading | Get latest reading |

---

## File: src/mqtt/subscriber.js

**Location:** `./src/mqtt/subscriber.js`  
**Purpose:** MQTT client that subscribes to sensor topics and saves incoming data (bonus feature).

```javascript
import mqtt from "mqtt";
import Sensor from "../models/Sensor.js";

const client = mqtt.connect("mqtt://test.mosquitto.org");

client.on("connect", () => {
  console.log("MQTT connected");

  client.subscribe("iot/sensor/+/temperature");
});

client.on("message", async (topic, message) => {
  const deviceId = topic.split("/")[2];
  const { temperature } = JSON.parse(message.toString());

  await Sensor.create({
    deviceId,
    temperature,
    timestamp: Date.now()
  });

  console.log("MQTT data saved for", deviceId);
});
```

### Line-by-Line Explanation

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import mqtt from "mqtt";` | **Import MQTT Client**: MQTT.js is a client library for the MQTT protocol - a lightweight messaging protocol for IoT devices. |
| 2 | `import Sensor from "../models/Sensor.js";` | **Import Model**: Brings in the Sensor model to save received data to MongoDB. |
| 4 | `const client = mqtt.connect("mqtt://test.mosquitto.org");` | **Connect to Broker**: Establishes connection to Eclipse Mosquitto's free public MQTT broker. `mqtt://` is the protocol, `test.mosquitto.org` is the broker hostname. This broker is free for testing purposes. |
| 6 | `client.on("connect", () => {` | **Connect Event Handler**: Event listener that fires when connection to the broker is successful. Event-driven architecture is common in MQTT. |
| 7 | `console.log("MQTT connected");` | **Connection Log**: Confirms MQTT connection is established. |
| 9 | `client.subscribe("iot/sensor/+/temperature");` | **Subscribe to Topic**: Subscribes to a topic pattern. The `+` is a single-level wildcard that matches any value. Pattern matches: `iot/sensor/sensor-01/temperature`, `iot/sensor/device-xyz/temperature`, etc. |
| 12 | `client.on("message", async (topic, message) => {` | **Message Event Handler**: Fires when a message is received on any subscribed topic. `topic` is the full topic string, `message` is a Buffer containing the payload. |
| 13 | `const deviceId = topic.split("/")[2];` | **Extract Device ID**: Splits topic by `/` and gets index 2. For `iot/sensor/sensor-01/temperature`, the array is `["iot", "sensor", "sensor-01", "temperature"]`, so index 2 is `"sensor-01"`. |
| 14 | `const { temperature } = JSON.parse(message.toString());` | **Parse Message**: Converts Buffer to string, then parses JSON. Extracts `temperature` value. Expects message format: `{"temperature": 25.5}`. |
| 16-20 | `await Sensor.create({...});` | **Save to Database**: Creates a new sensor document with the extracted deviceId, temperature, and current timestamp. Same as the REST API's ingest function. |
| 22 | `console.log("MQTT data saved for", deviceId);` | **Success Log**: Confirms data was saved for the specific device. |

### MQTT Concepts

```
┌─────────────┐     Publish      ┌─────────────┐     Deliver     ┌──────────────┐
│ IoT Device  │ ───────────────→ │ MQTT Broker │ ───────────────→ │  Subscriber  │
│ (Publisher) │                  │ (Mosquitto) │                  │ (Our Server) │
└─────────────┘                  └─────────────┘                  └──────────────┘
      |                                                                  |
      |    Topic: iot/sensor/sensor-01/temperature                       |
      |    Payload: {"temperature": 28.5}                                |
      |                                                                  ↓
      |                                                           Save to MongoDB
```

### Topic Wildcard Explanation

| Wildcard | Symbol | Matches |
|----------|--------|---------|
| Single-level | `+` | Any single level |
| Multi-level | `#` | Any remaining levels |

```
Topic Pattern: iot/sensor/+/temperature

Matches:
  ✅ iot/sensor/sensor-01/temperature
  ✅ iot/sensor/device-xyz/temperature
  ✅ iot/sensor/temp-001/temperature
  
Does NOT Match:
  ❌ iot/sensor/floor1/room2/temperature (too many levels)
  ❌ iot/device/sensor-01/temperature (wrong prefix)
```

---

## File: simulateDevice.js

**Location:** `./simulateDevice.js`  
**Purpose:** Test utility that simulates an IoT device publishing temperature data.

```javascript
import mqtt from "mqtt";

const client = mqtt.connect("mqtt://test.mosquitto.org");

client.on("connect", () => {
  setInterval(() => {
    const temp = (25 + Math.random() * 10).toFixed(2);

    client.publish(
      "iot/sensor/sensor-01/temperature",
      JSON.stringify({ temperature: Number(temp) })
    );

    console.log("Sent temp:", temp);
  }, 5000);
});
```

### Line-by-Line Explanation

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import mqtt from "mqtt";` | **Import MQTT Client**: Same library as subscriber, but this file acts as a publisher. |
| 3 | `const client = mqtt.connect("mqtt://test.mosquitto.org");` | **Connect to Broker**: Connects to the same public broker as the subscriber. Both publisher and subscriber connect to the same broker to exchange messages. |
| 5 | `client.on("connect", () => {` | **Connect Handler**: Executes once connected to the broker. |
| 6 | `setInterval(() => {` | **Repeating Timer**: `setInterval` executes the callback function repeatedly at specified intervals. Creates a loop that runs indefinitely. |
| 7 | `const temp = (25 + Math.random() * 10).toFixed(2);` | **Generate Random Temperature**: `Math.random()` returns 0-1 (exclusive), multiply by 10 gives 0-10, add 25 gives 25-35. `toFixed(2)` formats to 2 decimal places (returns string like `"28.45"`). |
| 9-12 | `client.publish(...)` | **Publish Message**: Sends a message to the specified topic. First argument is the topic string, second is the message payload. The subscriber receives this message because it subscribed to this topic pattern. |
| 10 | `"iot/sensor/sensor-01/temperature"` | **Topic**: The destination topic for this message. Matches the subscriber's pattern `iot/sensor/+/temperature`. |
| 11 | `JSON.stringify({ temperature: Number(temp) })` | **Message Payload**: Converts object to JSON string. `Number(temp)` converts the string from `toFixed()` back to a number for consistency. |
| 14 | `console.log("Sent temp:", temp);` | **Log Output**: Prints the sent temperature to console for verification. |
| 15 | `}, 5000);` | **Interval Duration**: 5000 milliseconds = 5 seconds. The function runs every 5 seconds. |

### Temperature Generation Math

```javascript
Math.random()              → 0.7234 (example)
Math.random() * 10         → 7.234
25 + (Math.random() * 10)  → 32.234
(25 + ...).toFixed(2)      → "32.23"
Number("32.23")            → 32.23

Result: Temperature between 25.00 and 35.00
```

---

## Data Flow Diagram

### HTTP Flow (REST API)

```
┌────────────┐     HTTP POST        ┌─────────────────┐
│   Client   │ ──────────────────→  │  Express Server │
│ (Postman)  │  /api/sensor/ingest  │                 │
└────────────┘  Body: {             │  ┌───────────┐  │
                 deviceId,          │  │  Router   │  │
                 temperature        │  └─────┬─────┘  │
                }                   │        │        │
                                    │        ▼        │
                                    │  ┌───────────┐  │
                                    │  │Controller │  │
                                    │  │ingestData │  │
                                    │  └─────┬─────┘  │
                                    │        │        │
                                    │        ▼        │
                                    │  ┌───────────┐  │
                                    │  │  Mongoose │  │
                                    │  │   Model   │  │
                                    │  └─────┬─────┘  │
                                    └────────┼────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │  MongoDB Atlas  │
                                    │    (Cloud DB)   │
                                    └─────────────────┘
```

### MQTT Flow (Real-time)

```
┌────────────┐     MQTT Publish     ┌─────────────────┐     MQTT Subscribe   ┌────────────┐
│ IoT Device │ ──────────────────→  │   MQTT Broker   │ ──────────────────→  │   Server   │
│ (Sensor)   │  Topic: iot/sensor/  │  (Mosquitto)    │  Topic: iot/sensor/  │ subscriber │
│            │  sensor-01/temp      │                 │  +/temperature       │            │
└────────────┘  Payload: {temp}     └─────────────────┘                      └──────┬─────┘
                                                                                    │
                                                                                    ▼
                                                                           ┌────────────────┐
                                                                           │ Mongoose Model │
                                                                           │  Sensor.create │
                                                                           └───────┬────────┘
                                                                                   │
                                                                                   ▼
                                                                           ┌────────────────┐
                                                                           │ MongoDB Atlas  │
                                                                           └────────────────┘
```

---

## Error Handling Strategy

### Layers of Error Handling

```
┌─────────────────────────────────────────────────────────────┐
│                    Error Handling Layers                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: Input Validation (Controller)                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ if (!deviceId || temperature === undefined)          │   │
│  │   → 400 Bad Request                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Layer 2: Business Logic Errors                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ if (!data)                                           │   │
│  │   → 404 Not Found                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Layer 3: Database/System Errors (try-catch)                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ catch (err)                                          │   │
│  │   → console.error + 500 Internal Server Error        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Layer 4: Startup Errors (db.js)                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ catch (err) in connectDB                             │   │
│  │   → console.error + process.exit(1)                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | HTTP server port |
| `MONGO_URI` | Yes | None | MongoDB Atlas connection string |

### .env File Example

```env
# Server Configuration
PORT=3000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/iot_sensors?retryWrites=true&w=majority
```

### Security Best Practices

1. **Never commit `.env` to Git** - Add to `.gitignore`
2. **Use `.env.example`** - Template without real values
3. **Rotate passwords** if exposed
4. **Use environment-specific values** - Different credentials for dev/staging/production

---

## Summary

This IoT Sensor Backend demonstrates several industry best practices:

| Practice | Implementation |
|----------|----------------|
| **Separation of Concerns** | Controllers, Routes, Models, Config in separate files |
| **Environment Configuration** | dotenv for managing secrets |
| **Error Handling** | Try-catch blocks, appropriate HTTP status codes |
| **Input Validation** | Required field checks before database operations |
| **Code Organization** | Modular architecture with clear file purposes |
| **Documentation** | README with setup instructions and API examples |
| **Real-time Capability** | MQTT integration for IoT device communication |

---

*Documentation generated for IoT Sensor Backend v1.0.0*
