const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { pool: db } = require("../config/db");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");

/* ================= LOGIN ================= */

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  // Sanitize input
  if (username.length > 100 || password.length > 200) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("Login DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    // Support both bcrypt hashes and legacy plain-text passwords
    let passwordMatch = false;
    if (user.password.startsWith("$2")) {
      // bcrypt hash
      passwordMatch = await bcrypt.compare(password, user.password);
    } else {
      // legacy plain text — migrate on successful login
      passwordMatch = password === user.password;
      if (passwordMatch) {
        // Auto-migrate to bcrypt
        const hash = await bcrypt.hash(password, 10);
        db.query("UPDATE users SET password = ? WHERE id = ?", [hash, user.id]);
      }
    }

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status === "inactive") {
      return res.status(403).json({
        message: "Your account is deactivated. Please contact the administrator.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "success",
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      department: user.department,
      token,
    });
  });
});

/* ================= GET PROFILE ================= */

router.get("/profile", verifyToken, (req, res) => {
  const sql = "SELECT id, username, name, email, role, department, status, avatar, bio, phone, created_at FROM users WHERE id = ?";

  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!results.length) return res.status(404).json({ message: "User not found" });
    res.json(results[0]);
  });
});

/* ================= UPDATE PROFILE ================= */

router.put("/profile", verifyToken, async (req, res) => {
  const { name, bio, phone } = req.body;

  try {
    await new Promise((resolve, reject) => {
      db.query(
        "UPDATE users SET name=?, bio=?, phone=? WHERE id=?",
        [name, bio, phone, req.user.id],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });

    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= CHANGE PASSWORD ================= */

router.put("/change-password", verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both fields required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const [rows] = await new Promise((resolve, reject) => {
      db.query("SELECT password FROM users WHERE id = ?", [req.user.id], (err, r) =>
        err ? reject(err) : resolve([r])
      );
    });

    if (!rows.length) return res.status(404).json({ message: "User not found" });

    const valid = rows[0].password.startsWith("$2")
      ? await bcrypt.compare(currentPassword, rows[0].password)
      : currentPassword === rows[0].password;

    if (!valid) return res.status(401).json({ message: "Current password is incorrect" });

    const hash = await bcrypt.hash(newPassword, 10);
    await new Promise((resolve, reject) => {
      db.query("UPDATE users SET password = ? WHERE id = ?", [hash, req.user.id], (err, r) =>
        err ? reject(err) : resolve(r)
      );
    });

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
