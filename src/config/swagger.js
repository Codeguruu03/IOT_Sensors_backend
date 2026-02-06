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
