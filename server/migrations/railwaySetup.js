/**
 * Railway MySQL Setup Script
 * Runs schema + migrations on the Railway cloud database
 */
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

// Railway public MySQL URL
const DB_CONFIG = {
  host: "reseau.proxy.rlwy.net",
  port: 40269,
  user: "root",
  password: "yQsuPWqLYzDnmorhgrVBwHgcitwoFDGV",
  database: "railway",
  ssl: { rejectUnauthorized: false },
  multipleStatements: false,
};

const statements = [
  // USERS
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150),
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','employee') DEFAULT 'employee',
    department VARCHAR(100),
    status ENUM('active','inactive') DEFAULT 'active',
    avatar VARCHAR(255) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    phone VARCHAR(30) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,

  // PROJECTS
  `CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE,
    due_date DATE,
    created_by INT,
    status ENUM('Pending','In Progress','Completed') DEFAULT 'Pending',
    acceptance_status ENUM('Pending','Accepted','Rejected') DEFAULT 'Pending',
    progress_percent INT DEFAULT 0,
    github_url VARCHAR(500) DEFAULT NULL,
    demo_url VARCHAR(500) DEFAULT NULL,
    estimated_completion DATE DEFAULT NULL,
    actual_completion DATE DEFAULT NULL,
    rejection_reason TEXT DEFAULT NULL,
    priority ENUM('Low','Medium','High','Critical') DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
  )`,

  // PROJECT MEMBERS
  `CREATE TABLE IF NOT EXISTS project_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    employee_id INT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

  // TASKS
  `CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_name VARCHAR(200) NOT NULL,
    description TEXT,
    employee_username VARCHAR(100),
    deadline DATETIME,
    priority ENUM('Low','Medium','High') DEFAULT 'Medium',
    status ENUM('Pending','In Progress','Submitted','Completed') DEFAULT 'Pending',
    uploaded_file VARCHAR(255),
    submitted_file VARCHAR(255),
    submission_text TEXT,
    project_id INT DEFAULT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
  )`,

  // NOTIFICATIONS
  `CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    type VARCHAR(50) DEFAULT 'general',
    link VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

  // NOTIFICATION (legacy)
  `CREATE TABLE IF NOT EXISTS notification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    message TEXT,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // AUDIT LOGS
  `CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action TEXT NOT NULL,
    performed_by VARCHAR(100),
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // CHATS
  `CREATE TABLE IF NOT EXISTS chats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('private','project') DEFAULT 'private',
    project_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  )`,

  // CHAT MEMBERS
  `CREATE TABLE IF NOT EXISTS chat_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT NOT NULL,
    user_id INT NOT NULL,
    UNIQUE KEY unique_member (chat_id, user_id),
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

  // MESSAGES
  `CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT NOT NULL,
    sender_id INT NOT NULL,
    message TEXT,
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    is_read TINYINT(1) DEFAULT 0,
    edited TINYINT(1) DEFAULT 0,
    deleted_for_everyone TINYINT(1) DEFAULT 0,
    deleted_by TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

  // PROJECT SUBMISSIONS
  `CREATE TABLE IF NOT EXISTS project_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    submitted_by INT NOT NULL,
    version INT DEFAULT 1,
    status ENUM('Pending Review','Approved','Rejected','Need Changes','Completed') DEFAULT 'Pending Review',
    github_url VARCHAR(500),
    demo_url VARCHAR(500),
    remarks TEXT,
    completion_percent INT DEFAULT 0,
    estimated_completion DATE,
    actual_completion DATE,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by INT DEFAULT NULL,
    rating INT DEFAULT NULL,
    review_feedback TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
  )`,

  // SUBMISSION FILES
  `CREATE TABLE IF NOT EXISTS submission_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size INT DEFAULT 0,
    uploaded_by INT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES project_submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
  )`,

  // SUBMISSION COMMENTS
  `CREATE TABLE IF NOT EXISTS submission_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT NOT NULL,
    project_id INT NOT NULL,
    parent_id INT DEFAULT NULL,
    author_id INT NOT NULL,
    comment TEXT NOT NULL,
    type ENUM('comment','review','change_request','approval') DEFAULT 'comment',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES project_submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

  // PROJECT PROGRESS
  `CREATE TABLE IF NOT EXISTS project_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    employee_id INT NOT NULL,
    progress_percent INT NOT NULL DEFAULT 0,
    note TEXT,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

  // PROJECT TIMELINE
  `CREATE TABLE IF NOT EXISTS project_timeline (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    description TEXT,
    performed_by INT,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSON DEFAULT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL
  )`,

  // ACTIVITY LOGS
  `CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT DEFAULT NULL,
    description TEXT NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  )`,

  // INDEXES — use INSERT IGNORE style via procedure
  `CREATE INDEX idx_tasks_employee ON tasks(employee_username)`,
  `CREATE INDEX idx_tasks_project ON tasks(project_id)`,
  `CREATE INDEX idx_tasks_status ON tasks(status)`,
  `CREATE INDEX idx_notifications_user ON notifications(user_id)`,
  `CREATE INDEX idx_project_submissions_project ON project_submissions(project_id)`,
  `CREATE INDEX idx_project_timeline_project ON project_timeline(project_id)`,
];

async function run() {
  console.log("🔌 Connecting to Railway MySQL...");
  const conn = await mysql.createConnection(DB_CONFIG);
  console.log("✅ Connected!\n");

  for (const sql of statements) {
    try {
      await conn.query(sql);
      const preview = sql.trim().replace(/\s+/g, " ").substring(0, 55);
      console.log(`✅ ${preview}...`);
    } catch (err) {
      if (err.code === "ER_DUP_KEYNAME" || err.code === "ER_DUP_KEY" || err.message.includes("Duplicate key")) {
        console.log(`⚠️  Index already exists — skipping`);
      } else {
        console.error(`❌ ${err.message}\n   SQL: ${sql.substring(0, 60)}`);
      }
    }
  }

  // Seed admin user
  console.log("\n👤 Seeding admin user...");
  const hash = await bcrypt.hash("admin123", 10);
  try {
    await conn.query(
      `INSERT IGNORE INTO users (username, name, email, password, role, department, status)
       VALUES ('admin','Administrator','admin@workflow.com',?,'admin','Management','active')`,
      [hash]
    );
    console.log("✅ Admin user ready (admin / admin123)");
  } catch (err) {
    console.error("Admin seed error:", err.message);
  }

  await conn.end();
  console.log("\n🎉 Railway database setup complete!");
}

run().catch(console.error);
