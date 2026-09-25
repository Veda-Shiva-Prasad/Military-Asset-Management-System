import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/auditLogs.css";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/audit-logs");

      setLogs(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return <div className="audit-loading">Loading audit logs...</div>;
  }

  if (error) {
    return <div className="audit-error">{error}</div>;
  }

  return (
    <div className="audit-page">
      <div className="audit-header">
        <div>
          <h1>Audit Logs</h1>
          <p>Track system transactions and user activities</p>
        </div>

        <button className="refresh-button" onClick={fetchAuditLogs}>
          Refresh
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="empty-state">No audit logs found.</div>
      ) : (
        <div className="audit-table-container">
          <table className="audit-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date & Time</th>
                <th>User</th>
                <th>Role</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Entity ID</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>

                  <td>{formatDate(log.createdAt)}</td>

                  <td>{log.User?.name || "Unknown User"}</td>

                  <td>
                    <span className="role-badge">
                      {log.User?.role || "UNKNOWN"}
                    </span>
                  </td>

                  <td>
                    <span className="action-badge">{log.action}</span>
                  </td>

                  <td>{log.entity}</td>

                  <td>{log.entityId || "-"}</td>

                  <td className="details-cell">{log.details || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
