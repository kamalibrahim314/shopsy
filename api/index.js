import app, { initApp } from "./src/app.controller.js";

// Ensure Express application middleware, routes, and error handlers are initialized
initApp();

// Export the Express app instance for Vercel Serverless Function execution
export default app;
