import express from "express";
import sensorRoutes from "./routes/sensor.routes.js";

const app = express();
app.use(express.json());

app.use("/api/sensor", sensorRoutes);

export default app;
