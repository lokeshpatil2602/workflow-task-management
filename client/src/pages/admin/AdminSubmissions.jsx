import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/AdminLayout";
import { toast } from "react-toastify";
import "./AdminSubmissions.css";

const BASE_URL = "http://localhost:5000";

const statusColors = {
  "Pending Review": "#f59e0b",
  "Approved":       "#22c55e",
  "Rejected":       "#ef4444",
  "Need Changes":   "#f97316",
  "Completed":      "#6366f1",
};

export default function AdminSubmissions() {
  const [queue, setQueue]         = useState([]);
  const [selected, setSelected]   = useState(null);
  const [detail, setDetail]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [view, setView]           = useState("queue"); // queue | detail
  const [feedback, setFeedback]   = useState("");
  const [rating, setRating]       = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");

  const loadQueue = useCallback(async () => {
    try {
      setLoading(true);
      const r = await api.get("/submissions/queue/pending");
      setQueue(r.data || []);
    } catch { toast.error("Failed to load queue"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadQueue(); }, [loadQueue]);

  const openSubmission = async (sub) => {
    try {
      const r = await api.get(`/submissions/detail/${sub.id}`);
      setDetail(r.data);
      setSelected(sub);
      setView("detail");
      setFeedback("");
      setRating(0);
    } catch { toast.error("Failed to load submission"); }
  };

  const doAction = async (action) => {
    if (!detail) return;
    if ((action === "reject" || action === "request-changes") && !feedback.trim()) {
      toast.warning("Please provide feedback/reason before taking this action");
      return;
    }
    try {
      setSubmitting(true);
      await api.put(`/submissions/${detail.id}/${action}`, {
        review_feedback: feedback,
        rating: rating || undefined,
      });
      toast.success(`Action "${action}" completed!`);
      setView("queue");
      setDetail(null);
      setSelected(null);
      loadQueue();
    } catch (e) { toast.error(e.response?.data?.message || "Error"); }
    finally { setSubmitting(false); }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post(`/submissions/${detail.id}/comment`, {
        comment: newComment,
        type: "review",
      });
      toast.success("Comment added");
      setNewComment("");
      // refresh detail
      const r = await api.get(`/submissions/detail/${detail.id}`);
      setDetail(r.data);
    } catch { toast.error("Failed to add comment"); }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString() : "—";

  return (
    <AdminLayout>
      <div className="as-container">

        {/* HEADER */}
        <div className="as-header">
          <div>
            <h2 className="as-title">📥 Submission Review Queue</h2>
            <p className="as-subtitle">Review and manage project submissions from employees</p>
          </div>
          {view === "detail" && (
            <button className="as-btn-back" onClick={() => { setView("queue"); setDetail(null); }}>
              ← Back to Queue
            </button>
          )}
        </div>

        {/* ── QUEUE VIEW ── */}
        {view === "queue" && (
          <>
            {loading ? (
              <div className="as-loading">Loading submissions...</div>
            ) : queue.length === 0 ? (
              <div className="as-empty">
                <div className="as-empty-icon">🎉</div>
                <h3>No Pending Submissions</h3>
                <p>All submissions have been reviewed!</p>
              </div>
            ) : (
              <>
                <div className="as-queue-stats">
                  <span className="as-badge-count">{queue.length} pending review</span>
                </div>
                <div className="as-queue-list">
                  {queue.map(sub => (
                    <div key={sub.id} className="as-queue-card" onClick={() => openSubmission(sub)}>
                      <div className="as-qc-left">
                        <h3>{sub.project_name}</h3>
                        <div className="as-qc-meta">
                          <span>👤 {sub.submitter_name}</span>
                          {sub.department && <span>🏢 {sub.department}</span>}
                          <span>📦 Version {sub.version}</span>
                          <span>📅 {fmtDate(sub.submitted_at)}</span>
                          <span>📊 {sub.completion_percent}% complete</span>
                        </div>
                      </div>
                      <div className="as-qc-right">
                        <span className="as-status-dot" style={{ background: statusColors[sub.status] }}>
                          {sub.status}
                        </span>
                        <button className="as-btn-review">Review →</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ── DETAIL VIEW ── */}
        {view === "detail" && detail && (
          <div className="as-detail">

            {/* Project Info */}
            <div className="as-detail-header">
              <div>
                <h3>{detail.project_name}</h3>
                <p className="as-detail-meta">
                  Submitted by <strong>{detail.submitter_name}</strong>
                  {detail.department && <> · {detail.department}</>}
                  · Version <strong>{detail.version}</strong>
                  · {fmtDate(detail.submitted_at)}
                </p>
              </div>
              <span className="as-status-badge" style={{ background: statusColors[detail.status] }}>
                {detail.status}
              </span>
            </div>

            {/* Submission Details */}
            <div className="as-info-grid">
              <div><strong>Completion</strong><span>{detail.completion_percent}%</span></div>
              <div><strong>Estimated</strong><span>{fmtDate(detail.estimated_completion)}</span></div>
              <div><strong>Actual</strong><span>{fmtDate(detail.actual_completion)}</span></div>
              {detail.github_url && <div><strong>GitHub</strong><a href={detail.github_url} target="_blank" rel="noreferrer">🔗 View Repo</a></div>}
              {detail.demo_url && <div><strong>Demo</strong><a href={detail.demo_url} target="_blank" rel="noreferrer">🌐 Live Demo</a></div>}
            </div>

            {detail.remarks && (
              <div className="as-remarks-box">
                <strong>📝 Employee Remarks:</strong>
                <p>{detail.remarks}</p>
              </div>
            )}

            {/* Files */}
            {detail.files?.length > 0 && (
              <div className="as-files-section">
                <h4>📎 Submitted Files</h4>
                <div className="as-files-grid">
                  {detail.files.map(f => (
                    <a key={f.id}
                      href={`${BASE_URL}/uploads/submissions/${f.file_path}`}
                      target="_blank" rel="noreferrer"
                      className="as-file-card"
                    >
                      <span className="as-file-icon">
                        {f.file_type?.includes("image") ? "🖼️" :
                         f.file_type?.includes("pdf") ? "📄" :
                         f.file_type?.includes("zip") ? "🗜️" :
                         f.file_type?.includes("video") ? "🎬" : "📁"}
                      </span>
                      <span className="as-file-name">{f.file_name}</span>
                      <span className="as-file-size">{(f.file_size / 1024).toFixed(1)} KB</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Review Actions */}
            {detail.status === "Pending Review" && (
              <div className="as-review-panel">
                <h4>📋 Review Decision</h4>

                {/* Rating */}
                <div className="as-rating-row">
                  <label>Rating (optional):</label>
                  <div className="as-stars">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} className={`as-star ${rating >= s ? "filled" : ""}`}
                        onClick={() => setRating(s)}>⭐</button>
                    ))}
                    {rating > 0 && <span className="as-rating-val">{rating}/5</span>}
                  </div>
                </div>

                {/* Feedback */}
                <div className="as-feedback-row">
                  <label>Feedback / Reason (required for Reject / Request Changes):</label>
                  <textarea rows={4} placeholder="Provide detailed feedback..." value={feedback}
                    onChange={e => setFeedback(e.target.value)} />
                </div>

                {/* Action Buttons */}
                <div className="as-action-btns">
                  <button className="as-btn as-btn-approve" disabled={submitting} onClick={() => doAction("approve")}>
                    ✅ Approve
                  </button>
                  <button className="as-btn as-btn-changes" disabled={submitting} onClick={() => doAction("request-changes")}>
                    🔄 Request Changes
                  </button>
                  <button className="as-btn as-btn-reject" disabled={submitting} onClick={() => doAction("reject")}>
                    ❌ Reject
                  </button>
                </div>
              </div>
            )}

            {/* Previous Review */}
            {detail.review_feedback && detail.status !== "Pending Review" && (
              <div className="as-prev-review">
                <h4>Previous Review</h4>
                <p>{detail.review_feedback}</p>
                {detail.rating && <span className="as-prev-rating">{"⭐".repeat(detail.rating)} ({detail.rating}/5)</span>}
                <span className="as-prev-by">Reviewed by: {detail.reviewer_name} on {fmtDate(detail.reviewed_at)}</span>
              </div>
            )}

            {/* Comments Thread */}
            <div className="as-comments-section">
              <h4>💬 Discussion ({detail.comments?.length || 0})</h4>
              {detail.comments?.map(c => (
                <div key={c.id} className={`as-comment ${c.author_role}`}>
                  <div className="as-comment-header">
                    <strong>{c.author_name}</strong>
                    <span className={`as-comment-role ${c.author_role}`}>{c.author_role}</span>
                    <span className="as-comment-time">{new Date(c.created_at).toLocaleString()}</span>
                  </div>
                  <p>{c.comment}</p>
                </div>
              ))}
              <div className="as-add-comment">
                <textarea rows={3} placeholder="Add a comment or note..." value={newComment}
                  onChange={e => setNewComment(e.target.value)} />
                <button className="as-btn as-btn-comment" onClick={addComment} disabled={!newComment.trim()}>
                  💬 Add Comment
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
}
