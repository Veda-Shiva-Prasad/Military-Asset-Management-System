import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    baseId: "1",
    equipmentTypeId: "1",
    startDate: "",
    endDate: "",
  });

  const [showMovement, setShowMovement] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard", {
        params: {
          baseId: filters.baseId,
          equipmentTypeId: filters.equipmentTypeId,
          startDate: filters.startDate,
          endDate: filters.endDate,
        },
      });

      setDashboard(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [
    filters.baseId,
    filters.equipmentTypeId,
    filters.startDate,
    filters.endDate,
  ]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Asset Dashboard</h1>
          <p>Military Asset Management System</p>
        </div>
      </div>

      <div className="dashboard-filters">
        <div className="filter-group">
          <label>Base</label>

          <select
            name="baseId"
            value={filters.baseId}
            onChange={handleFilterChange}
          >
            <option value="1">Bangalore Base</option>
            <option value="2">Hyderabad Base</option>
            <option value="3">Pune Base</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Equipment Type</label>

          <select
            name="equipmentTypeId"
            value={filters.equipmentTypeId}
            onChange={handleFilterChange}
          >
            <option value="1">Vehicles</option>
            <option value="2">Weapons</option>
            <option value="3">Communication Equipment</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Start Date</label>

          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>End Date</label>

          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <span>Opening Balance</span>
          <strong>{dashboard?.openingBalance ?? 0}</strong>
        </div>

        <div className="metric-card">
          <span>Purchases</span>
          <strong>{dashboard?.purchases ?? 0}</strong>
        </div>

        <div className="metric-card">
          <span>Transfer In</span>
          <strong>{dashboard?.transferIn ?? 0}</strong>
        </div>

        <div className="metric-card">
          <span>Transfer Out</span>
          <strong>{dashboard?.transferOut ?? 0}</strong>
        </div>

        <div
          className="metric-card clickable"
          onClick={() => setShowMovement(true)}
        >
          <span>Net Movement</span>

          <strong>{dashboard?.netMovement ?? 0}</strong>

          <small>Click for details</small>
        </div>

        <div className="metric-card">
          <span>Assigned</span>
          <strong>{dashboard?.assigned ?? 0}</strong>
        </div>

        <div className="metric-card">
          <span>Expended</span>
          <strong>{dashboard?.expended ?? 0}</strong>
        </div>

        <div className="metric-card closing-card">
          <span>Closing Balance</span>
          <strong>{dashboard?.closingBalance ?? 0}</strong>
        </div>
      </div>

      {showMovement && (
        <div className="modal-overlay" onClick={() => setShowMovement(false)}>
          <div className="movement-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Net Movement Details</h2>

              <button
                className="close-button"
                onClick={() => setShowMovement(false)}
              >
                ×
              </button>
            </div>

            <div className="movement-details">
              <div>
                <span>Purchases</span>

                <strong>{dashboard?.purchases ?? 0}</strong>
              </div>

              <div>
                <span>Transfer In</span>

                <strong>{dashboard?.transferIn ?? 0}</strong>
              </div>

              <div>
                <span>Transfer Out</span>

                <strong>{dashboard?.transferOut ?? 0}</strong>
              </div>

              <hr />

              <div>
                <span>Net Movement</span>

                <strong>{dashboard?.netMovement ?? 0}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
