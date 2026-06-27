import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import EmployeeLayout from "../../components/EmployeeLayout";
import { toast } from "react-toastify";
import "../../assets/employeeProjects.css";
import "./EmployeeProjectsNew.css";

const BASE_URL = "http://localhost:5000";

/* ─── helpers ─── */
const fmtDate = (d) => d?.split("T")[0] || "—";
const fmtStatus = (s) => s?.replace(/\s+/g, "").toLowerCase() || "pending";
const progressSteps = [0,10,20,30,40,50,60,70,80,90,100];

export default function EmployeeProjects() {
  const [projects, setProjects]         = useState([]);
  const [selected, setSelected]         = useState(null);
  const [view, setView]                 = useState("list"); // list | detail | submit | history
  const [loading, setLoading]           = useState(true);
  const [submitting, setSubmitting]     = useState(false);
  const [submissions, setSubmissions]   = useState([]);
  const [timeline, setTimeline]         = useState([]);
  const [progressHist, setProgressHist] = useState([]);
  const [activeTab, setActiveTab]       = useState("overview"); // overview | tasks | submit | history | timeline
  const [taskSubmitting, setTaskSubmitting] = useState(null);
  const [selectedFiles, setSelectedFiles]   = useState({});
  const [submissionText, setSubmissionText] = useState({});

  /* submission form state */
  const [form, setForm] = useState({
    github_url: "", demo_url: "", remarks: "",
    completion_percent: 0, estimated_completion: "", actual_completion: "",
    files: [],
  });

  /* ─── loaders ─── */
  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const r = await api.get("/projects");
      setProjects(r.data || []);
    } catch { toast.error("Failed to load projects"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const openProject = async (p) => {
    try {
      const [detail, subs, tl, ph] = await Promise.all([
        api.get(`/projects/${p.id}`),
        api.get(`/submissions/${p.id}/my-submissions`),
        api.get(`/submissions/${p.id}/timeline`),
        api.get(`/submissions/${p.id}/progress-history`),
      ]);
      setSelected({
        ...detail.data.project,
        members: detail.data.members || [],
        tasks: detail.data.tasks || [],
        stats: detail.data.stats || {},
      });
      setSubmissions(subs.data || []);
      setTimeline(tl.data || []);
      setProgressHist(ph.data || []);
      setView("detail");
      setActiveTab("overview");
    } catch { toast.error("Failed to load project"); }
  };

  const refreshProject = async () => {
    if (!selected) return;
    try {
      const [detail, subs, tl, ph] = await Promise.all([
        api.get(`/projects/${selected.id}`),
        api.get(`/submissions/${selected.id}/my-submissions`),
        api.get(`/submissions/${selected.id}/timeline`),
        api.get(`/submissions/${selected.id}/progress-history`),
      ]);
      setSelected(prev => ({
        ...prev,
        ...detail.data.project,
        members: detail.data.members,
        tasks: detail.data.tasks,
        stats: detail.data.stats,
      }));
      setSubmissions(subs.data || []);
      setTimeline(tl.data || []);
      setProgressHist(ph.data || []);
    } catch {}
  };

  /* ─── project actions ─── */
  const acceptProject = async () => {
    try {
      await api.post(`/submissions/${selected.id}/accept`);
      toast.success("Project accepted!");
      refreshProject();
    } catch (e) { toast.error(e.response?.data?.message || "Error"); }
  };

  const rejectProject = async () => {
    const reason = prompt("Reason for rejection:");
    if (!reason) return;
    try {
      await api.post(`/submissions/${selected.id}/reject`, { reason });
      toast.success("Project rejected");
      refreshProject();
    } catch (e) { toast.error(e.response?.data?.message || "Error"); }
  };

  const startProject = async () => {
    try {
      await api.post(`/submissions/${selected.id}/start`);
      toast.success("Project started!");
      refreshProject();
    } catch (e) { toast.error(e.response?.data?.message || "Error"); }
  };

  const updateProgress = async (pct) => {
    const note = prompt(`Note for ${pct}% progress (optional):`) || "";
    try {
      await api.post(`/submissions/${selected.id}/progress`, { progress_percent: pct, note });
      toast.success(`Progress updated to ${pct}%`);
      refreshProject();
    } catch (e) { toast.error(e.response?.data?.message || "Error"); }
  };

  /* ─── task status update ─── */
  const handleTaskStatus = async (taskId, status) => {
    try {
      await api.patch(`/employee/tasks/status/${taskId}`, { status });
      toast.success(`Status → ${status}`);
      refreshProject();
    } catch { toast.error("Failed to update status"); }
  };

  /* ─── task work submit ─── */
  const handleTaskSubmit = async (taskId) => {
    const file = selectedFiles[taskId];
    const text = submissionText[taskId];
    if (!file && !text) { toast.warning("Add file or text first"); return; }
    const fd = new FormData();
    if (file) fd.append("file", file);
    if (text) fd.append("text", text);
    try {
      setTaskSubmitting(taskId);
      await api.post(`/tasks/employee/submit/${taskId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Work submitted!");
      setSelectedFiles(p => ({ ...p, [taskId]: null }));
      setSubmissionText(p => ({ ...p, [taskId]: "" }));
      refreshProject();
    } catch { toast.error("Submission failed"); }
    finally { setTaskSubmitting(null); }
  };

  /* ─── project submission ─── */
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("github_url", form.github_url);
    fd.append("demo_url", form.demo_url);
    fd.append("remarks", form.remarks);
    fd.append("completion_percent", form.completion_percent);
    fd.append("estimated_completion", form.estimated_completion);
    fd.append("actual_completion", form.actual_completion);
    form.files.forEach(f => fd.append("files", f));
    try {
      setSubmitting(true);
      await api.post(`/submissions/${selected.id}/submit`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Project submitted for review!");
      setForm({ github_url:"", demo_url:"", remarks:"", completion_percent:0, estimated_completion:"", actual_completion:"", files:[] });
      setActiveTab("history");
      refreshProject();
    } catch (e) { toast.error(e.response?.data?.message || "Submission failed"); }
    finally { setSubmitting(false); }
  };

  /* ─── status badge color map ─── */
  const subStatusColor = {
    "Pending Review": "#f59e0b",
    "Approved":       "#22c55e",
    "Rejected":       "#ef4444",
    "Need Changes":   "#f97316",
    "Completed":      "#6366f1",
  };

  const tlIcon = {
    assigned:"📋", accepted:"✅", rejected:"❌", started:"🚀",
    progress_updated:"📈", submitted:"📤", reviewed:"👁️",
    approved:"🏆", changes_requested:"🔄", completed:"🎉",
    comment_added:"💬", file_uploaded:"📁",
  };

  /* ═══════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════ */
  return (
    <EmployeeLayout>
      <div className="ep-container">

        {/* ── HEADER ── */}
        <div className="ep-header">
          <div>
            <h2 className="ep-title">
              {view === "list" ? "📁 My Projects" : selected?.project_name}
            </h2>
            {view !== "list" && (
              <span className={`ep-status-badge ${fmtStatus(selected?.status)}`}>
                {selected?.status}
              </span>
            )}
          </div>
          {view !== "list" && (
            <button className="ep-btn-back" onClick={() => { setView("list"); setSelected(null); loadProjects(); }}>
              ← Back
            </button>
          )}
        </div>

        {/* ── PROJECT LIST ── */}
        {view === "list" && (
          <>
            {loading ? (
              <div className="ep-skeleton-grid">
                {[1,2,3,4].map(i => <div key={i} className="ep-skeleton-card" />)}
              </div>
            ) : projects.length === 0 ? (
              <div className="ep-empty">
                <div className="ep-empty-icon">📭</div>
                <h3>No Projects Assigned</h3>
                <p>Your admin will assign projects to you soon.</p>
              </div>
            ) : (
              <div className="ep-grid">
                {projects.map(p => (
                  <div key={p.id} className="ep-card" onClick={() => openProject(p)}>
                    <div className="ep-card-top">
                      <h3>{p.project_name}</h3>
                      <span className={`ep-status-badge ${fmtStatus(p.status)}`}>{p.status}</span>
                    </div>
                    <p className="ep-card-desc">{p.description}</p>
                    <div className="ep-progress-bar">
                      <div className="ep-progress-fill" style={{ width: `${p.progress_percent || 0}%` }} />
                    </div>
                    <div className="ep-card-footer">
                      <span>📅 {fmtDate(p.start_date)} → {fmtDate(p.due_date)}</span>
                      <span className="ep-progress-pct">{p.progress_percent || 0}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── PROJECT DETAIL ── */}
        {view === "detail" && selected && (
          <div className="ep-detail">

            {/* Action Buttons */}
            <div className="ep-action-bar">
              {selected.acceptance_status === "Pending" && (
                <>
                  <button className="ep-btn ep-btn-success" onClick={acceptProject}>✅ Accept Project</button>
                  <button className="ep-btn ep-btn-danger" onClick={rejectProject}>❌ Reject Project</button>
                </>
              )}
              {selected.acceptance_status === "Accepted" && selected.status === "Pending" && (
                <button className="ep-btn ep-btn-primary" onClick={startProject}>🚀 Start Project</button>
              )}
              {selected.status === "In Progress" && (
                <>
                  <div className="ep-progress-selector">
                    <label>Update Progress:</label>
                    <div className="ep-progress-btns">
                      {progressSteps.map(pct => (
                        <button
                          key={pct}
                          className={`ep-pct-btn ${selected.progress_percent === pct ? "active" : ""}`}
                          onClick={() => updateProgress(pct)}
                        >{pct}%</button>
                      ))}
                    </div>
                  </div>
                  <button className="ep-btn ep-btn-primary" onClick={() => setActiveTab("submit")}>
                    📤 Submit Project
                  </button>
                </>
              )}
            </div>

            {/* Stats Row */}
            <div className="ep-stats-row">
              <div className="ep-stat"><span className="ep-stat-val">{selected.stats?.totalTasks || 0}</span><span>Total Tasks</span></div>
              <div className="ep-stat"><span className="ep-stat-val">{selected.stats?.completedTasks || 0}</span><span>Completed</span></div>
              <div className="ep-stat"><span className="ep-stat-val">{selected.progress_percent || 0}%</span><span>Progress</span></div>
              <div className="ep-stat"><span className="ep-stat-val">{selected.members?.length || 0}</span><span>Members</span></div>
              <div className="ep-stat"><span className="ep-stat-val">{submissions.length}</span><span>Submissions</span></div>
            </div>

            {/* Tabs */}
            <div className="ep-tabs">
              {["overview","tasks","submit","history","timeline"].map(t => (
                <button key={t} className={`ep-tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
                  {{ overview:"📊 Overview", tasks:"✅ Tasks", submit:"📤 Submit", history:"📜 History", timeline:"🕐 Timeline" }[t]}
                </button>
              ))}
            </div>

            {/* ── TAB: OVERVIEW ── */}
            {activeTab === "overview" && (
              <div className="ep-tab-content">
                <div className="ep-info-grid">
                  <div><strong>Start Date</strong><span>{fmtDate(selected.start_date)}</span></div>
                  <div><strong>Due Date</strong><span>{fmtDate(selected.due_date)}</span></div>
                  <div><strong>Priority</strong><span>{selected.priority || "Medium"}</span></div>
                  <div><strong>Acceptance</strong><span>{selected.acceptance_status || "Pending"}</span></div>
                  {selected.github_url && <div><strong>GitHub</strong><a href={selected.github_url} target="_blank" rel="noreferrer">🔗 Repository</a></div>}
                  {selected.demo_url && <div><strong>Demo</strong><a href={selected.demo_url} target="_blank" rel="noreferrer">🌐 Live Demo</a></div>}
                </div>
                <p className="ep-desc-block">{selected.description}</p>
                <div className="ep-big-progress">
                  <div className="ep-big-fill" style={{ width: `${selected.progress_percent || 0}%` }}>
                    {selected.progress_percent > 10 && `${selected.progress_percent}%`}
                  </div>
                </div>
                {selected.rejection_reason && (
                  <div className="ep-rejection-box">⚠️ <strong>Rejection Reason:</strong> {selected.rejection_reason}</div>
                )}
              </div>
            )}

            {/* ── TAB: TASKS ── */}
            {activeTab === "tasks" && (
              <div className="ep-tab-content">
                {selected.tasks.length === 0 ? (
                  <div className="ep-empty-sm">No tasks assigned yet</div>
                ) : selected.tasks.map(task => (
                  <div key={task.id} className="ep-task-card">
                    <div className="ep-task-header">
                      <h4>{task.task_name}</h4>
                      <span className={`ep-task-badge ${fmtStatus(task.status)}`}>{task.status}</span>
                    </div>
                    <p>{task.description}</p>
                    <div className="ep-task-meta">
                      <span>📅 {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}</span>
                      <span className={`ep-priority ${task.priority?.toLowerCase()}`}>{task.priority}</span>
                    </div>
                    {task.status !== "Completed" && (
                      <div className="ep-task-status-row">
                        <label>Status:</label>
                        <select value={task.status} onChange={e => handleTaskStatus(task.id, e.target.value)}>
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </div>
                    )}
                    {task.submitted_file && (
                      <a className="ep-file-link" href={`${BASE_URL}/uploads/${task.submitted_file}`} target="_blank" rel="noreferrer">
                        📎 View Submission
                      </a>
                    )}
                    {!task.submitted_file && task.status !== "Completed" && (
                      <div className="ep-submit-box">
                        <textarea placeholder="Describe your work..." value={submissionText[task.id] || ""}
                          onChange={e => setSubmissionText(p => ({ ...p, [task.id]: e.target.value }))} />
                        <input key={task.id} type="file"
                          onChange={e => setSelectedFiles(p => ({ ...p, [task.id]: e.target.files[0] }))} />
                        <button className="ep-btn ep-btn-primary" disabled={taskSubmitting === task.id}
                          onClick={() => handleTaskSubmit(task.id)}>
                          {taskSubmitting === task.id ? "Submitting..." : "Submit Work"}
                        </button>
                      </div>
                    )}
                    {task.status === "Completed" && <p className="ep-completed-tag">✅ Task Completed</p>}
                  </div>
                ))}
              </div>
            )}

            {/* ── TAB: SUBMIT PROJECT ── */}
            {activeTab === "submit" && (
              <div className="ep-tab-content">
                <h3 className="ep-section-title">📤 Submit Project for Review</h3>
                <form onSubmit={handleProjectSubmit} className="ep-submit-form">
                  <div className="ep-form-row">
                    <label>GitHub Repository URL</label>
                    <input type="url" placeholder="https://github.com/..." value={form.github_url}
                      onChange={e => setForm(p => ({ ...p, github_url: e.target.value }))} />
                  </div>
                  <div className="ep-form-row">
                    <label>Live Demo URL</label>
                    <input type="url" placeholder="https://..." value={form.demo_url}
                      onChange={e => setForm(p => ({ ...p, demo_url: e.target.value }))} />
                  </div>
                  <div className="ep-form-row">
                    <label>Completion Percentage</label>
                    <div className="ep-range-row">
                      <input type="range" min="0" max="100" step="5" value={form.completion_percent}
                        onChange={e => setForm(p => ({ ...p, completion_percent: Number(e.target.value) }))} />
                      <span className="ep-range-val">{form.completion_percent}%</span>
                    </div>
                  </div>
                  <div className="ep-form-two">
                    <div className="ep-form-row">
                      <label>Estimated Completion</label>
                      <input type="date" value={form.estimated_completion}
                        onChange={e => setForm(p => ({ ...p, estimated_completion: e.target.value }))} />
                    </div>
                    <div className="ep-form-row">
                      <label>Actual Completion</label>
                      <input type="date" value={form.actual_completion}
                        onChange={e => setForm(p => ({ ...p, actual_completion: e.target.value }))} />
                    </div>
                  </div>
                  <div className="ep-form-row">
                    <label>Remarks / Notes</label>
                    <textarea rows={4} placeholder="Describe what you've completed, challenges faced..." value={form.remarks}
                      onChange={e => setForm(p => ({ ...p, remarks: e.target.value }))} />
                  </div>
                  <div className="ep-form-row">
                    <label>Upload Files (ZIP, PDF, Images, Videos — up to 10 files, 50MB each)</label>
                    <input type="file" multiple accept=".zip,.pdf,.jpg,.jpeg,.png,.gif,.mp4,.webm,.doc,.docx,.xls,.xlsx"
                      onChange={e => setForm(p => ({ ...p, files: Array.from(e.target.files) }))} />
                    {form.files.length > 0 && (
                      <div className="ep-file-list">
                        {form.files.map((f, i) => <span key={i} className="ep-file-chip">📎 {f.name}</span>)}
                      </div>
                    )}
                  </div>
                  <button type="submit" className="ep-btn ep-btn-primary ep-btn-lg" disabled={submitting}>
                    {submitting ? "Submitting..." : "🚀 Submit Project"}
                  </button>
                </form>
              </div>
            )}

            {/* ── TAB: SUBMISSION HISTORY ── */}
            {activeTab === "history" && (
              <div className="ep-tab-content">
                <h3 className="ep-section-title">📜 Submission History</h3>
                {submissions.length === 0 ? (
                  <div className="ep-empty-sm">No submissions yet. Use the Submit tab to submit your project.</div>
                ) : submissions.map(sub => (
                  <div key={sub.id} className="ep-sub-card">
                    <div className="ep-sub-header">
                      <span className="ep-sub-version">Version {sub.version}</span>
                      <span className="ep-sub-status" style={{ background: subStatusColor[sub.status] || "#94a3b8" }}>
                        {sub.status}
                      </span>
                      <span className="ep-sub-date">{new Date(sub.submitted_at).toLocaleDateString()}</span>
                    </div>
                    <div className="ep-sub-body">
                      {sub.github_url && <a href={sub.github_url} target="_blank" rel="noreferrer">🔗 GitHub</a>}
                      {sub.demo_url && <a href={sub.demo_url} target="_blank" rel="noreferrer">🌐 Demo</a>}
                      {sub.remarks && <p><strong>Remarks:</strong> {sub.remarks}</p>}
                      {sub.completion_percent > 0 && <p><strong>Completion:</strong> {sub.completion_percent}%</p>}
                      {sub.review_feedback && (
                        <div className="ep-feedback-box">
                          <strong>📝 Admin Feedback:</strong>
                          <p>{sub.review_feedback}</p>
                          {sub.rating && <span className="ep-rating">{"⭐".repeat(sub.rating)} ({sub.rating}/5)</span>}
                        </div>
                      )}
                      {sub.files?.length > 0 && (
                        <div className="ep-sub-files">
                          <strong>Files:</strong>
                          {sub.files.map(f => (
                            <a key={f.id} href={`${BASE_URL}/uploads/submissions/${f.file_path}`} target="_blank" rel="noreferrer" className="ep-file-chip">
                              📎 {f.file_name}
                            </a>
                          ))}
                        </div>
                      )}
                      {sub.comments?.length > 0 && (
                        <div className="ep-comments">
                          <strong>💬 Comments:</strong>
                          {sub.comments.map(c => (
                            <div key={c.id} className={`ep-comment ${c.author_role}`}>
                              <span className="ep-comment-author">{c.author_name} ({c.author_role})</span>
                              <p>{c.comment}</p>
                              <span className="ep-comment-time">{new Date(c.created_at).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── TAB: TIMELINE ── */}
            {activeTab === "timeline" && (
              <div className="ep-tab-content">
                <h3 className="ep-section-title">🕐 Project Timeline</h3>
                {timeline.length === 0 ? (
                  <div className="ep-empty-sm">No timeline events yet</div>
                ) : (
                  <div className="ep-timeline">
                    {timeline.map((ev, i) => (
                      <div key={ev.id} className="ep-tl-item">
                        <div className="ep-tl-dot">{tlIcon[ev.event_type] || "📌"}</div>
                        <div className="ep-tl-content">
                          <p className="ep-tl-desc">{ev.description}</p>
                          <span className="ep-tl-time">
                            {ev.performed_by_name && <strong>{ev.performed_by_name} • </strong>}
                            {new Date(ev.performed_at).toLocaleString()}
                          </span>
                        </div>
                        {i < timeline.length - 1 && <div className="ep-tl-line" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </EmployeeLayout>
  );
}
