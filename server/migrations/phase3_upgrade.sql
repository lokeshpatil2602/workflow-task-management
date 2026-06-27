-- =============================================
-- PHASE 3 UPGRADE MIGRATION
-- Task Management System → SaaS PM System
-- =============================================

USE workflow;

-- =============================================
-- 1. Fix users table: add password_hash column
--    (keep password col for backward compat during transition)
-- =============================================
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS avatar VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS phone VARCHAR(30) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- =============================================
-- 2. Fix projects table: add acceptance/progress fields
-- =============================================
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS acceptance_status ENUM('Pending','Accepted','Rejected') DEFAULT 'Pending',
  ADD COLUMN IF NOT EXISTS progress_percent INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS github_url VARCHAR(500) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS demo_url VARCHAR(500) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS estimated_completion DATE DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS actual_completion DATE DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS priority ENUM('Low','Medium','High','Critical') DEFAULT 'Medium',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- =============================================
-- 3. PROJECT SUBMISSIONS
-- =============================================
CREATE TABLE IF NOT EXISTS project_submissions (
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
  rating INT DEFAULT NULL COMMENT '1-5 stars',
  review_feedback TEXT,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- 4. SUBMISSION FILES
-- =============================================
CREATE TABLE IF NOT EXISTS submission_files (
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
);

-- =============================================
-- 5. SUBMISSION COMMENTS (review comments + replies)
-- =============================================
CREATE TABLE IF NOT EXISTS submission_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  submission_id INT NOT NULL,
  project_id INT NOT NULL,
  parent_id INT DEFAULT NULL COMMENT 'For replies',
  author_id INT NOT NULL,
  comment TEXT NOT NULL,
  type ENUM('comment','review','change_request','approval') DEFAULT 'comment',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES project_submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES submission_comments(id) ON DELETE CASCADE
);

-- =============================================
-- 6. PROJECT PROGRESS LOG
-- =============================================
CREATE TABLE IF NOT EXISTS project_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  employee_id INT NOT NULL,
  progress_percent INT NOT NULL DEFAULT 0,
  note TEXT,
  logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- 7. PROJECT TIMELINE EVENTS
-- =============================================
CREATE TABLE IF NOT EXISTS project_timeline (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  event_type ENUM(
    'assigned','accepted','rejected','started',
    'progress_updated','submitted','reviewed',
    'approved','changes_requested','completed','comment_added','file_uploaded'
  ) NOT NULL,
  description TEXT,
  performed_by INT,
  performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSON DEFAULT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- 8. ACTIVITY LOGS (global, replaces audit_logs for UI)
-- =============================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action_type ENUM(
    'login','logout','create','update','delete',
    'assign','submit','approve','reject','comment',
    'download','upload','accept','start','complete'
  ) NOT NULL,
  entity_type ENUM('user','task','project','submission','comment','file','notification') NOT NULL,
  entity_id INT DEFAULT NULL,
  description TEXT NOT NULL,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- 9. UNIFY NOTIFICATIONS — drop legacy table
--    and add type + link columns to main table
-- =============================================
ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS type ENUM(
    'task_assigned','task_approved','task_rejected',
    'project_assigned','project_accepted','project_rejected',
    'submission_received','submission_approved','submission_rejected',
    'comment_added','deadline_near','general'
  ) DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS link VARCHAR(500) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- =============================================
-- 10. DATABASE INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_tasks_employee ON tasks(employee_username);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_project_members_project ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_employee ON project_members(employee_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_project_submissions_project ON project_submissions(project_id);
CREATE INDEX IF NOT EXISTS idx_project_timeline_project ON project_timeline(project_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);

-- =============================================
-- 11. Update admin password to bcrypt hash
--     Hash of "admin123"
-- =============================================
UPDATE users SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE username = 'admin';
