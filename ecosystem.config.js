module.exports = {
  apps: [
    {
      name: "workflow-server",
      script: "./server/index.js",
      instances: "max",          // Use all CPU cores
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      error_file: "./logs/server-error.log",
      out_file:   "./logs/server-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
};
