import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/forms.css";
import "../styles/tables.css";

const Assignments = () => {
  const { user } = useAuth();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    baseId: user?.baseId ? String(user.baseId) : "1",
    equipmentTypeId: "1",
    personnelName: "",
    quantity: "",
  });

  const [historyFilters, setHistoryFilters] = useState({
    equipmentTypeId: "",
    startDate: "",
    endDate: "",
  });

  const baseOptions = [
    { id: "1", name: "Bangalore Base" },
    { id: "2", name: "Hyderabad Base" },
    { id: "3", name: "Pune Base" },
  ];

  const equipmentOptions = [
    { id: "1", name: "Vehicles" },
    { id: "2", name: "Weapons" },
    { id: "3", name: "Communication Equipment" },
  ];

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/assignments");

      setAssignments(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load assignment history",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (user?.baseId) {
      setFormData((previous) => ({
        ...previous,
        baseId: String(user.baseId),
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterChange = (e) => {
    setHistoryFilters({
      ...historyFilters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (Number(formData.quantity) <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    if (!formData.personnelName.trim()) {
      setError("Personnel name is required");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/assignments", {
        baseId: Number(formData.baseId),
        equipmentTypeId: Number(formData.equipmentTypeId),
        personnelName: formData.personnelName.trim(),
        quantity: Number(formData.quantity),
      });

      setSuccess("Assignment recorded successfully");

      setFormData({
        baseId: user?.baseId ? String(user.baseId) : "1",
        equipmentTypeId: "1",
        personnelName: "",
        quantity: "",
      });

      await fetchAssignments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const equipmentMatch =
        !historyFilters.equipmentTypeId ||
        String(assignment.equipmentTypeId) ===
          String(historyFilters.equipmentTypeId);

      const assignmentDate = assignment.assignmentDate
        ? assignment.assignmentDate.substring(0, 10)
        : "";

      const startDateMatch =
        !historyFilters.startDate || assignmentDate >= historyFilters.startDate;

      const endDateMatch =
        !historyFilters.endDate || assignmentDate <= historyFilters.endDate;

      return equipmentMatch && startDateMatch && endDateMatch;
    });
  }, [assignments, historyFilters]);

  const canSelectBase = user?.role === "ADMIN";

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Assignments</h1>
          <p>Assign equipment to military personnel</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {success && <div className="success-message">{success}</div>}

      <div className="form-card">
        <h2>Record Assignment</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Base</label>

              <select
                name="baseId"
                value={formData.baseId}
                onChange={handleChange}
                disabled={!canSelectBase}
                required
              >
                {baseOptions.map((base) => (
                  <option key={base.id} value={base.id}>
                    {base.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Equipment Type</label>

              <select
                name="equipmentTypeId"
                value={formData.equipmentTypeId}
                onChange={handleChange}
                required
              >
                {equipmentOptions.map((equipment) => (
                  <option key={equipment.id} value={equipment.id}>
                    {equipment.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Personnel Name</label>

              <input
                type="text"
                name="personnelName"
                value={formData.personnelName}
                onChange={handleChange}
                placeholder="Enter personnel name"
                required
              />
            </div>

            <div className="form-group">
              <label>Quantity</label>

              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={submitting}
          >
            {submitting ? "Recording..." : "Record Assignment"}
          </button>
        </form>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div>
            <h2>Assignment History</h2>
            <p>{filteredAssignments.length} record(s)</p>
          </div>
        </div>

        <div className="history-filters">
          <div className="form-group">
            <label>Equipment Type</label>

            <select
              name="equipmentTypeId"
              value={historyFilters.equipmentTypeId}
              onChange={handleFilterChange}
            >
              <option value="">All Equipment</option>

              {equipmentOptions.map((equipment) => (
                <option key={equipment.id} value={equipment.id}>
                  {equipment.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Start Date</label>

            <input
              type="date"
              name="startDate"
              value={historyFilters.startDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="form-group">
            <label>End Date</label>

            <input
              type="date"
              name="endDate"
              value={historyFilters.endDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading assignments...</div>
        ) : filteredAssignments.length === 0 ? (
          <div className="empty-state">No assignment records found.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Base</th>
                  <th>Equipment</th>
                  <th>Personnel</th>
                  <th>Quantity</th>
                  <th>Date & Time</th>
                </tr>
              </thead>

              <tbody>
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td>{assignment.id}</td>

                    <td>{assignment.Base?.name || "Unknown"}</td>

                    <td>{assignment.EquipmentType?.name || "Unknown"}</td>

                    <td>{assignment.personnelName}</td>

                    <td>{assignment.quantity}</td>

                    <td>
                      {new Date(assignment.assignmentDate).toLocaleString(
                        "en-IN",
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;
