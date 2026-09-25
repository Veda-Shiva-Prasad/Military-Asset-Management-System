import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/forms.css";
import "../styles/tables.css";

const Expenditures = () => {
  const { user } = useAuth();

  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    baseId: user?.baseId ? String(user.baseId) : "1",
    equipmentTypeId: "1",
    quantity: "",
    expenditureDate: "",
    description: "",
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

  const fetchExpenditures = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/expenditures");

      setExpenditures(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load expenditure history",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenditures();
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

    try {
      setSubmitting(true);

      await api.post("/expenditures", {
        baseId: Number(formData.baseId),
        equipmentTypeId: Number(formData.equipmentTypeId),
        quantity: Number(formData.quantity),
        expenditureDate: formData.expenditureDate,
        description: formData.description,
      });

      setSuccess("Expenditure recorded successfully");

      setFormData({
        baseId: user?.baseId ? String(user.baseId) : "1",
        equipmentTypeId: "1",
        quantity: "",
        expenditureDate: "",
        description: "",
      });

      await fetchExpenditures();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record expenditure");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredExpenditures = useMemo(() => {
    return expenditures.filter((expenditure) => {
      const equipmentMatch =
        !historyFilters.equipmentTypeId ||
        String(expenditure.equipmentTypeId) ===
          String(historyFilters.equipmentTypeId);

      const expenditureDate = expenditure.expenditureDate
        ? expenditure.expenditureDate.substring(0, 10)
        : "";

      const startDateMatch =
        !historyFilters.startDate ||
        expenditureDate >= historyFilters.startDate;

      const endDateMatch =
        !historyFilters.endDate || expenditureDate <= historyFilters.endDate;

      return equipmentMatch && startDateMatch && endDateMatch;
    });
  }, [expenditures, historyFilters]);

  const canSelectBase = user?.role === "ADMIN";

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Expenditures</h1>
          <p>Record and review consumed equipment</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {success && <div className="success-message">{success}</div>}

      <div className="form-card">
        <h2>Record Expenditure</h2>

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

            <div className="form-group">
              <label>Expenditure Date</label>

              <input
                type="date"
                name="expenditureDate"
                value={formData.expenditureDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter expenditure description"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={submitting}
          >
            {submitting ? "Recording..." : "Record Expenditure"}
          </button>
        </form>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div>
            <h2>Expenditure History</h2>
            <p>{filteredExpenditures.length} record(s)</p>
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
          <div className="loading">Loading expenditures...</div>
        ) : filteredExpenditures.length === 0 ? (
          <div className="empty-state">No expenditure records found.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Base</th>
                  <th>Equipment</th>
                  <th>Quantity</th>
                  <th>Date & Time</th>
                  <th>Description</th>
                </tr>
              </thead>

              <tbody>
                {filteredExpenditures.map((expenditure) => (
                  <tr key={expenditure.id}>
                    <td>{expenditure.id}</td>

                    <td>{expenditure.Base?.name || "Unknown"}</td>

                    <td>{expenditure.EquipmentType?.name || "Unknown"}</td>

                    <td>{expenditure.quantity}</td>

                    <td>
                      {new Date(expenditure.expenditureDate).toLocaleString(
                        "en-IN",
                      )}
                    </td>

                    <td>{expenditure.description || "-"}</td>
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

export default Expenditures;
