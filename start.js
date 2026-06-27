/**
 * Smart startup script — detects if this is frontend or backend service
 * RAILWAY_SERVICE_NAME is set automatically by Railway
 */
const serviceName = process.env.RAILWAY_SERVICE_NAME || "";
const isClient = serviceName.toLowerCase().includes("client") || process.env.START_MODE === "client";

if (isClient) {
  const { spawn } = require("child_process");
  const path = require("path");
  const fs = require("fs");
  const port = process.env.PORT || 3000;

  // Find dist folder — check multiple locations
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "dist"),
    path.join(cwd, "client", "dist"),
    path.join(__dirname, "dist"),
    path.join(__dirname, "client", "dist"),
    "/app/dist",
    "/app/client/dist",
  ];

  let distPath = candidates.find(p => {
    const exists = fs.existsSync(path.join(p, "index.html"));
    console.log(`Checking ${p}/index.html: ${exists}`);
    return exists;
  });

  if (!distPath) {
    console.error("❌ Cannot find dist/index.html — searched:", candidates);
    process.exit(1);
  }

  console.log(`🌐 Frontend server starting on port ${port}`);
  console.log(`📁 Serving: ${distPath}`);

  const child = spawn(
    "node",
    ["node_modules/.bin/serve", distPath, "-l", String(port)],
    { stdio: "inherit", cwd: cwd, env: process.env }
  );
  child.on("exit", (code) => process.exit(code));
} else {
  // Start backend server
  console.log("🚀 Starting backend server...");
  require("./server/index.js");
}
