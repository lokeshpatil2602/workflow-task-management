const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function run() {
  const conn = await mysql.createConnection({
    host: "localhost", user: "root", password: "", database: "workflow"
  });

  // Get all users
  const [users] = await conn.query("SELECT id, username, password FROM users");
  
  for (const user of users) {
    // If password doesn't start with $2 it's plain text — hash it
    if (!user.password.startsWith("$2")) {
      const hash = await bcrypt.hash(user.password, 10);
      await conn.query("UPDATE users SET password = ? WHERE id = ?", [hash, user.id]);
      console.log(`✅ Hashed password for user: ${user.username}`);
    } else {
      console.log(`⏭️  Already hashed: ${user.username}`);
    }
  }

  // Verify admin login works
  const [rows] = await conn.query("SELECT password FROM users WHERE username = 'admin'");
  if (rows.length) {
    const ok = await bcrypt.compare("admin123", rows[0].password);
    console.log(`\n🔑 admin/admin123 login test: ${ok ? "✅ PASS" : "❌ FAIL"}`);
    if (!ok) {
      // Force reset
      const newHash = await bcrypt.hash("admin123", 10);
      await conn.query("UPDATE users SET password = ? WHERE username = 'admin'", [newHash]);
      console.log("🔧 Force-reset admin password to admin123");
    }
  }

  await conn.end();
  console.log("\n✅ Password migration complete!");
}

run().catch(console.error);
