import { bootstrap } from "./src/app.controller.js";

bootstrap()
    .then((server) => {
        console.log("Shopsy API service initialized successfully.");
        setInterval(() => {}, 1000 * 60 * 60);
    })
    .catch((error) => {
        console.error("Application startup failed:", error);
        process.exitCode = 1;
    });
