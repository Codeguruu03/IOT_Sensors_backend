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
