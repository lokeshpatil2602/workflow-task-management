const mysql = require("mysql2/promise");

const statements = [
  // Projects table additions
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS acceptance_status ENUM('Pending','Accepted','Rejected') DEFAULT 'Pending'`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS progress_percent INT DEFAULT 0`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_url VARCHAR(500) DEFAULT NULL`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS demo_url VARCHAR(500) DEFAULT NULL`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS estimated_completion DATE DEFAULT NULL`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS actual_completion DATE DEFAULT NULL`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS rejection_reason TEXT DEFAULT NULL`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS priority ENUM('Low','Medium','High','Critical') DEFAULT 'Medium'`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,

  // Project submissions
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

  // Submission files
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

  // Submission comments
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

  // Project progress log
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

  // Project timeline
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

  // Activity logs
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

  // Add columns to notifications
  `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'general'`,
  `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS link VARCHAR(500) DEFAULT NULL`,

  // Indexes
  `CREATE INDEX IF NOT EXISTS idx_tasks_employee ON tasks(employee_username)`,
  `CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id)`,
  `CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)`,
  `CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read)`,
  `CREATE INDEX IF NOT EXISTS idx_project_members_project ON project_members(project_id)`,
  `CREATE INDEX IF NOT EXISTS idx_project_submissions_project ON project_submissions(project_id)`,
  `CREATE INDEX IF NOT EXISTS idx_project_timeline_project ON project_timeline(project_id)`,
  `CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id)`,

  // Update admin password to bcrypt hash of "admin123"
  `UPDATE users SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE username = 'admin'`,
];

async function run() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "workflow",
    multipleStatements: false,
  });

  console.log("✅ Connected to MySQL");

  for (const sql of statements) {
    try {
      await conn.query(sql);
      const preview = sql.trim().substring(0, 60).replace(/\s+/g, " ");
      console.log(`✅ OK: ${preview}...`);
    } catch (err) {
      if (err.code === "ER_DUP_KEYNAME" || err.message.includes("Duplicate key")) {
        console.log(`⚠️  Index already exists, skipping`);
      } else {
        console.error(`❌ FAILED: ${err.message}`);
        console.error(`   SQL: ${sql.substring(0, 80)}`);
      }
    }
  }

  await conn.end();
  console.log("\n🎉 Migration complete!");
}

run().catch(console.error);
