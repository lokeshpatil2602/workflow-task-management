/**
 * Smart startup script — detects if this is frontend or backend service
 * RAILWAY_SERVICE_NAME is set automatically by Railway
 */
const serviceName = process.env.RAILWAY_SERVICE_NAME || "";
const isClient = serviceName.toLowerCase().includes("client") || process.env.START_MODE === "client";

if (isClient) {
  // Serve static React build
  const { execSync, spawn } = require("child_process");
  const port = process.env.PORT || 3000;
  console.log(`🌐 Starting frontend server on port ${port}...`);
  const child = spawn("node", ["node_modules/.bin/serve", "-s", "dist", "-l", String(port)], {
    stdio: "inherit",
    cwd: __dirname,
    env: process.env,
  });
  child.on("exit", (code) => process.exit(code));
} else {
  // Start backend server
  console.log("🚀 Starting backend server...");
  require("./server/index.js");
}
