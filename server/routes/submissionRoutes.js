const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { promisePool: db } = require("../config/db");
const verifyToken = require("../middleware/verifyToken");
const authorizeRoles = require("../middleware/roleMiddleware");
const { createNotification } = require("../utils/notificationService");

/* ================= MULTER — SUBMISSION FILES ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/submissions"));
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
    cb(null, Date.now() + "-" + safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg","image/png","image/jpg","image/gif","image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain","text/csv",
      "application/zip","application/x-zip-compressed",
      "video/mp4","video/webm",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`File type not allowed: ${file.mimetype}`), false);
  },
});

/* ================= HELPER — LOG TIMELINE EVENT ================= */

const logTimeline = async (projectId, eventType, description, performedBy, metadata = null) => {
  try {
    await db.query(
      `INSERT INTO project_timeline (project_id, event_type, description, performed_by, metadata)
       VALUES (?, ?, ?, ?, ?)`,
      [projectId, eventType, description, performedBy, metadata ? JSON.stringify(metadata) : null]
    );
  } catch (err) {
    console.error("Timeline log error:", err);
  }
};

/* ================= HELPER — LOG ACTIVITY ================= */

const logActivity = async (userId, actionType, entityType, entityId, description, req) => {
  try {
    const ip = req?.ip || req?.connection?.remoteAddress || null;
    await db.query(
      `INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id, description, ip_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, actionType, entityType, entityId, description, ip]
    );
  } catch (err) {
    console.error("Activity log error:", err);
  }
};

/* ================================================================
   EMPLOYEE: ACCEPT PROJECT
================================================================ */

router.post("/:projectId/accept", verifyToken, authorizeRoles("employee"), async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;
  const io = req.app.get("io");

  try {
    // Verify membership
    const [member] = await db.query(
      "SELECT 1 FROM project_members WHERE project_id = ? AND employee_id = ?",
      [projectId, userId]
    );
    if (!member.length) return res.status(403).json({ message: "Not a member of this project" });

    await db.query(
      "UPDATE projects SET acceptance_status = 'Accepted' WHERE id = ?",
      [projectId]
    );

    await logTimeline(projectId, "accepted", `Project accepted by ${req.user.username}`, userId);
    await logActivity(userId, "accept", "project", projectId, `Accepted project ID ${projectId}`, req);

    // Notify admins
    const [admins] = await db.query("SELECT id FROM users WHERE role = 'admin'");
    for (const admin of admins) {
      await createNotification(
        admin.id,
        `${req.user.username} accepted project ID ${projectId}`,
        "project_accepted",
        `/admin/projects`,
        io
      );
    }

    res.json({ message: "Project accepted" });
  } catch (err) {
    console.error("Accept error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================================================
   EMPLOYEE: REJECT PROJECT
================================================================ */

router.post("/:projectId/reject", verifyToken, authorizeRoles("employee"), async (req, res) => {
  const { projectId } = req.params;
  const { reason } = req.body;
  const userId = req.user.id;
  const io = req.app.get("io");

  try {
    const [member] = await db.query(
      "SELECT 1 FROM project_members WHERE project_id = ? AND employee_id = ?",
      [projectId, userId]
    );
    if (!member.length) return res.status(403).json({ message: "Not a member of this project" });

    await db.query(
      "UPDATE projects SET acceptance_status = 'Rejected', rejection_reason = ? WHERE id = ?",
      [reason || null, projectId]
    );

    await logTimeline(projectId, "rejected", `Project rejected by ${req.user.username}. Reason: ${reason || "N/A"}`, userId);
    await logActivity(userId, "reject", "project", projectId, `Rejected project ID ${projectId}`, req);

    const [admins] = await db.query("SELECT id FROM users WHERE role = 'admin'");
    for (const admin of admins) {
      await createNotification(
        admin.id,
        `${req.user.username} rejected project ID ${projectId}`,
        "project_rejected",
        `/admin/projects`,
        io
      );
    }

    res.json({ message: "Project rejected" });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================================================
   EMPLOYEE: START PROJECT
================================================================ */

router.post("/:projectId/start", verifyToken, authorizeRoles("employee"), async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  try {
    const [member] = await db.query(
      "SELECT 1 FROM project_members WHERE project_id = ? AND employee_id = ?",
      [projectId, userId]
    );
    if (!member.length) return res.status(403).json({ message: "Not a member of this project" });

    await db.query(
      "UPDATE projects SET status = 'In Progress', acceptance_status = 'Accepted' WHERE id = ?",
      [projectId]
    );

    await logTimeline(projectId, "started", `Project started by ${req.user.username}`, userId);
    await logActivity(userId, "start", "project", projectId, `Started project ID ${projectId}`, req);

    res.json({ message: "Project started" });
  } catch (err) {
    console.error("Start error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================================================
   EMPLOYEE: UPDATE PROGRESS
================================================================ */

router.post("/:projectId/progress", verifyToken, authorizeRoles("employee"), async (req, res) => {
  const { projectId } = req.params;
  const { progress_percent, note } = req.body;
  const userId = req.user.id;
  const io = req.app.get("io");

  if (progress_percent === undefined || progress_percent < 0 || progress_percent > 100) {
    return res.status(400).json({ message: "progress_percent must be 0–100" });
  }

  try {
    const [member] = await db.query(
      "SELECT 1 FROM project_members WHERE project_id = ? AND employee_id = ?",
      [projectId, userId]
    );
    if (!member.length) return res.status(403).json({ message: "Not a member" });

    // Update project progress
    await db.query(
      "UPDATE projects SET progress_percent = ? WHERE id = ?",
      [progress_percent, projectId]
    );

    // Log to progress table
    await db.query(
      "INSERT INTO project_progress (project_id, employee_id, progress_percent, note) VALUES (?, ?, ?, ?)",
      [projectId, userId, progress_percent, note || null]
    );

    await logTimeline(
      projectId, "progress_updated",
      `Progress updated to ${progress_percent}% by ${req.user.username}`,
      userId, { progress_percent, note }
    );

    // Notify admins if milestone (25/50/75/100)
    if ([25, 50, 75, 100].includes(Number(progress_percent))) {
      const [admins] = await db.query("SELECT id FROM users WHERE role = 'admin'");
      for (const admin of admins) {
        await createNotification(
          admin.id,
          `Project ${projectId}: ${req.user.username} updated progress to ${progress_percent}%`,
          "general",
          `/admin/projects`,
          io
        );
      }
    }

    res.json({ message: "Progress updated" });
  } catch (err) {
    console.error("Progress error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================================================
   EMPLOYEE: SUBMIT PROJECT
================================================================ */

router.post(
  "/:projectId/submit",
  verifyToken,
  authorizeRoles("employee"),
  upload.array("files", 10),
  async (req, res) => {
    const { projectId } = req.params;
    const {
      github_url, demo_url, remarks,
      completion_percent, estimated_completion, actual_completion,
    } = req.body;
    const userId = req.user.id;
    const io = req.app.get("io");

    try {
      // Verify membership
      const [member] = await db.query(
        "SELECT 1 FROM project_members WHERE project_id = ? AND employee_id = ?",
        [projectId, userId]
      );
      if (!member.length) return res.status(403).json({ message: "Not a member" });

      // Get latest version
      const [latest] = await db.query(
        "SELECT MAX(version) AS maxV FROM project_submissions WHERE project_id = ?",
        [projectId]
      );
      const version = (latest[0].maxV || 0) + 1;

      // Create submission
      const [result] = await db.query(
        `INSERT INTO project_submissions
         (project_id, submitted_by, version, status, github_url, demo_url, remarks,
          completion_percent, estimated_completion, actual_completion)
         VALUES (?, ?, ?, 'Pending Review', ?, ?, ?, ?, ?, ?)`,
        [
          projectId, userId, version,
          github_url || null, demo_url || null, remarks || null,
          completion_percent || 0,
          estimated_completion || null,
          actual_completion || null,
        ]
      );

      const submissionId = result.insertId;

      // Save uploaded files
      if (req.files && req.files.length) {
        for (const file of req.files) {
          await db.query(
            `INSERT INTO submission_files (submission_id, file_name, file_path, file_type, file_size, uploaded_by)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [submissionId, file.originalname, file.filename, file.mimetype, file.size, userId]
          );
        }
      }

      // Update project status
      await db.query(
        "UPDATE projects SET status = 'In Progress', progress_percent = ? WHERE id = ?",
        [completion_percent || 0, projectId]
      );

      await logTimeline(
        projectId, "submitted",
        `Project submitted (v${version}) by ${req.user.username}`,
        userId, { submissionId, version }
      );
      await logActivity(userId, "submit", "submission", submissionId, `Submitted project ID ${projectId} v${version}`, req);

      // Notify all admins
      const [admins] = await db.query("SELECT id FROM users WHERE role = 'admin'");
      for (const admin of admins) {
        await createNotification(
          admin.id,
          `${req.user.username} submitted project ID ${projectId} (v${version}) for review`,
          "submission_received",
          `/admin/projects`,
          io
        );
      }

      res.status(201).json({ message: "Submitted successfully", submissionId, version });
    } catch (err) {
      console.error("Submission error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ================================================================
   EMPLOYEE: GET MY SUBMISSIONS FOR A PROJECT
================================================================ */

router.get("/:projectId/my-submissions", verifyToken, authorizeRoles("employee"), async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  try {
    const [submissions] = await db.query(
      `SELECT ps.*, u.username AS reviewer_name
       FROM project_submissions ps
       LEFT JOIN users u ON ps.reviewed_by = u.id
       WHERE ps.project_id = ? AND ps.submitted_by = ?
       ORDER BY ps.version DESC`,
      [projectId, userId]
    );

    // Fetch files for each submission
    for (const sub of submissions) {
      const [files] = await db.query(
        "SELECT * FROM submission_files WHERE submission_id = ?",
        [sub.id]
      );
      sub.files = files;

      const [comments] = await db.query(
        `SELECT sc.*, u.username AS author_name, u.role AS author_role
         FROM submission_comments sc
         JOIN users u ON sc.author_id = u.id
         WHERE sc.submission_id = ?
         ORDER BY sc.created_at ASC`,
        [sub.id]
      );
      sub.comments = comments;
    }

    res.json(submissions);
  } catch (err) {
    console.error("My submissions error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================================================
   ADMIN: GET ALL SUBMISSIONS FOR A PROJECT
================================================================ */

router.get("/:projectId/all", verifyToken, authorizeRoles("admin"), async (req, res) => {
  const { projectId } = req.params;

  try {
    const [submissions] = await db.query(
      `SELECT ps.*, 
              u.username AS submitter_name, u.department,
              r.username AS reviewer_name
       FROM project_submissions ps
       JOIN users u ON ps.submitted_by = u.id
       LEFT JOIN users r ON ps.reviewed_by = r.id
       WHERE ps.project_id = ?
       ORDER BY ps.version DESC`,
      [projectId]
    );

    for (const sub of submissions) {
      const [files] = await db.query(
        "SELECT * FROM submission_files WHERE submission_id = ?",
        [sub.id]
      );
      sub.files = files;

      const [comments] = await db.query(
        `SELECT sc.*, u.username AS author_name, u.role AS author_role
         FROM submission_comments sc
         JOIN users u ON sc.author_id = u.id
         WHERE sc.submission_id = ?
         ORDER BY sc.created_at ASC`,
        [sub.id]
      );
      sub.comments = comments;
    }

    res.json(submissions);
  } catch (err) {
    console.error("All submissions error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================================================
   ADMIN: REVIEW — APPROVE SUBMISSION
================================================================ */

router.put("/:submissionId/approve", verifyToken, authorizeRoles("admin"), async (req, res) => {
  const { submissionId } = req.params;
  const { rating, review_feedback } = req.body;
  const adminId = req.user.id;
  const io = req.app.get("io");

  try {
    const [sub] = await db.query(
      "SELECT * FROM project_submissions WHERE id = ?",
      [submissionId]
    );
    if (!sub.length) return res.status(404).json({ message: "Submission not found" });

    await db.query(
      `UPDATE project_submissions
       SET status = 'Approved', reviewed_by = ?, reviewed_at = NOW(),
           rating = ?, review_feedback = ?
       WHERE id = ?`,
      [adminId, rating || null, review_feedback || null, submissionId]
    );

    // Update project status to Completed
    await db.query(
      "UPDATE projects SET status = 'Completed', actual_completion = CURDATE() WHERE id = ?",
      [sub[0].project_id]
    );

    await logTimeline(
      sub[0].project_id, "approved",
      `Submission v${sub[0].version} approved by ${req.user.username}`,
      adminId
    );

    // Notify employee
    await createNotification(
      sub[0].submitted_by,
      `Your project submission (v${sub[0].version}) was approved ✅${rating ? ` — Rating: ${rating}/5` : ""}`,
      "submission_approved",
      `/employee/projects`,
      io
    );

    res.json({ message: "Submission approved" });
  } catch (err) {
    console.error("Approve submission error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================================================
   ADMIN: REVIEW — REJECT SUBMISSION
================================================================ */

router.put("/:submissionId/reject", verifyToken, authorizeRoles("admin"), async (req, res) => {
  const { submissionId } = req.params;
  const { review_feedback } = req.body;
  const adminId = req.user.id;
  const io = req.app.get("io");

  if (!review_feedback) {
    return res.status(400).json({ message: "Rejection reason is required" });
  }

  try {
    const [sub] = await db.query(
      "SELECT * FROM project_submissions WHERE id = ?",
      [submissionId]
    );
    if (!sub.length) return res.status(404).json({ message: "Submission not found" });

    await db.query(
      `UPDATE project_submissions
       SET status = 'Rejected', reviewed_by = ?, reviewed_at = NOW(), review_feedback = ?
       WHERE id = ?`,
      [adminId, review_feedback, submissionId]
    );

    await logTimeline(
      sub[0].project_id, "reviewed",
      `Submission v${sub[0].version} rejected by ${req.user.username}`,
      adminId
    );

    await createNotification(
      sub[0].submitted_by,
      `Your project submission (v${sub[0].version}) was rejected ❌. Reason: ${review_feedback}`,
      "submission_rejected",
      `/employee/projects`,
      io
    );

    res.json({ message: "Submission rejected" });
  } catch (err) {
    console.error("Reject submission error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================================================
   ADMIN: REQUEST CHANGES
================================================================ */

router.put("/:submissionId/request-changes", verifyToken, authorizeRoles("admin"), async (req, res) => {
  const { submissionId } = req.params;
  const { review_feedback } = req.body;
  const adminId = req.user.id;
  const io = req.app.get("io");

  if (!review_feedback) {
    return res.status(400).json({ message: "Please specify required changes" });
  }

  try {
    const [sub] = await db.query(
      "SELECT * FROM project_submissions WHERE id = ?",
      [submissionId]
    );
    if (!sub.length) return res.status(404).json({ message: "Submission not found" });

    await db.query(
      `UPDATE project_submissions
       SET status = 'Need Changes', reviewed_by = ?, reviewed_at = NOW(), review_feedback = ?
       WHERE id = ?`,
      [adminId, review_feedback, submissionId]
    );

    await logTimeline(
      sub[0].project_id, "changes_requested",
      `Changes requested on v${sub[0].version} by ${req.user.username}: ${review_feedback}`,
      adminId
    );

    await createNotification(
      sub[0].submitted_by,
      `Changes requested on your submission (v${sub[0].version}): ${review_feedback}`,
      "submission_rejected",
      `/employee/projects`,
      io
    );

    res.json({ message: "Changes requested" });
  } catch (err) {
    console.error("Request changes error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================================================
   ADD COMMENT ON SUBMISSION
================================================================ */

router.post("/:submissionId/comment", verifyToken, async (req, res) => {
  const { submissionId } = req.params;
  const { comment, parent_id, type } = req.body;
  const userId = req.user.id;
  const io = req.app.get("io");

  if (!comment?.trim()) {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }

  try {
    const [sub] = await db.query(
      "SELECT project_id, submitted_by FROM project_submissions WHERE id = ?",
      [submissionId]
    );
    if (!sub.length) return res.status(404).json({ message: "Submission not found" });

    const [result] = await db.query(
      `INSERT INTO submission_comments (submission_id, project_id, parent_id, author_id, comment, type)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [submissionId, sub[0].project_id, parent_id || null, userId, comment.trim(), type || "comment"]
    );

    await logTimeline(
      sub[0].project_id, "comment_added",
      `Comment added by ${req.user.username}`,
      userId
    );

    // Notify the submitter if admin comments
    if (req.user.role === "admin" && sub[0].submitted_by !== userId) {
      await createNotification(
        sub[0].submitted_by,
        `Admin ${req.user.username} commented on your submission`,
        "comment_added",
        `/employee/projects`,
        io
      );
    }

    const [newComment] = await db.query(
      `SELECT sc.*, u.username AS author_name, u.role AS author_role
       FROM submission_comments sc
       JOIN users u ON sc.author_id = u.id
       WHERE sc.id = ?`,
      [result.insertId]
    );

    res.status(201).json(newComment[0]);
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================================================
   GET PROJECT TIMELINE
================================================================ */

router.get("/:projectId/timeline", verifyToken, async (req, res) => {
  const { projectId } = req.params;

  try {
    const [timeline] = await db.query(
      `SELECT pt.*, u.username AS performed_by_name, u.role AS performed_by_role
       FROM project_timeline pt
       LEFT JOIN users u ON pt.performed_by = u.id
       WHERE pt.project_id = ?
       ORDER BY pt.performed_at ASC`,
      [projectId]
    );

    res.json(timeline);
  } catch (err) {
    console.error("Timeline error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================================================
   GET PROGRESS HISTORY
================================================================ */

router.get("/:projectId/progress-history", verifyToken, async (req, res) => {
  const { projectId } = req.params;

  try {
    const [history] = await db.query(
      `SELECT pp.*, u.username
       FROM project_progress pp
       JOIN users u ON pp.employee_id = u.id
       WHERE pp.project_id = ?
       ORDER BY pp.logged_at ASC`,
      [projectId]
    );

    res.json(history);
  } catch (err) {
    console.error("Progress history error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================================================
   ADMIN: SUBMISSION QUEUE (all pending submissions)
================================================================ */

router.get("/queue/pending", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const [submissions] = await db.query(
      `SELECT ps.*, 
              p.project_name, 
              u.username AS submitter_name, u.department
       FROM project_submissions ps
       JOIN projects p ON ps.project_id = p.id
       JOIN users u ON ps.submitted_by = u.id
       WHERE ps.status = 'Pending Review'
       ORDER BY ps.submitted_at ASC`
    );

    res.json(submissions);
  } catch (err) {
    console.error("Queue error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================================================
   GET SUBMISSION DETAIL
================================================================ */

router.get("/detail/:submissionId", verifyToken, async (req, res) => {
  const { submissionId } = req.params;

  try {
    const [sub] = await db.query(
      `SELECT ps.*, 
              p.project_name, p.description AS project_description,
              u.username AS submitter_name, u.department,
              r.username AS reviewer_name
       FROM project_submissions ps
       JOIN projects p ON ps.project_id = p.id
       JOIN users u ON ps.submitted_by = u.id
       LEFT JOIN users r ON ps.reviewed_by = r.id
       WHERE ps.id = ?`,
      [submissionId]
    );

    if (!sub.length) return res.status(404).json({ message: "Not found" });

    const [files] = await db.query(
      "SELECT * FROM submission_files WHERE submission_id = ?",
      [submissionId]
    );

    const [comments] = await db.query(
      `SELECT sc.*, u.username AS author_name, u.role AS author_role
       FROM submission_comments sc
       JOIN users u ON sc.author_id = u.id
       WHERE sc.submission_id = ?
       ORDER BY sc.created_at ASC`,
      [submissionId]
    );

    res.json({ ...sub[0], files, comments });
  } catch (err) {
    console.error("Detail error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
