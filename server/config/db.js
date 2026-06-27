const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host:             process.env.DB_HOST     || "localhost",
  port:             process.env.DB_PORT     || 3306,
  user:             process.env.DB_USER     || "root",
  password:         process.env.DB_PASSWORD || "",
  database:         process.env.DB_NAME     || "workflow",
  waitForConnections: true,
  connectionLimit:  10,
  queueLimit:       0,
});

const promisePool = pool.promise();

// Connection test on startup
(async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log("✅ MySQL Connected Successfully");
    connection.release();
  } catch (err) {
    console.error("❌ MySQL Connection Failed:", err.message);
    if (err.code === "ECONNREFUSED")    console.error("👉 MySQL server is not running");
    if (err.code === "ER_ACCESS_DENIED_ERROR") console.error("👉 Invalid username/password");
    if (err.code === "ER_BAD_DB_ERROR") console.error("👉 Database does not exist");
  }
})();

module.exports = { pool, promisePool };
