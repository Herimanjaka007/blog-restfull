import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Blog Restfull",
        version: "1.0.0"
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "server for local dev."
        },
        {
            url: "https://blog-restfull-hahw.onrender.com",
            description: "server for prod."
        },
    ],
};

const options = {
    definition: swaggerDefinition,
    apis: ["./routes/*.js", "./swaggerComponents.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;