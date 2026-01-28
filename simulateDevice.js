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
