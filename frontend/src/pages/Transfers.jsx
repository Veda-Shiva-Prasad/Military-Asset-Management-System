import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/forms.css";
import "../styles/tables.css";

const Transfers = () => {
  const { user } = useAuth();

  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    fromBaseId: user?.baseId ? String(user.baseId) : "1",
    toBaseId: "2",
    equipmentTypeId: "1",
    quantity: "",
    description: "",
  });

  const [historyFilters, setHistoryFilters] = useState({
    equipmentTypeId: "",
    startDate: "",
    endDate: "",
  });

  const baseOptions = [
    {
      id: "1",
      name: "Bangalore Base",
    },
    {
      id: "2",
      name: "Hyderabad Base",
    },
    {
      id: "3",
      name: "Pune Base",
    },
  ];

  const equipmentOptions = [
    {
      id: "1",
      name: "Vehicles",
    },
    {
      id: "2",
      name: "Weapons",
    },
    {
      id: "3",
      name: "Communication Equipment",
    },
  ];

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/transfers");

      setTransfers(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load transfer history",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  useEffect(() => {
    if (user?.baseId) {
      setFormData((previous) => ({
        ...previous,
        fromBaseId: String(user.baseId),
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

    if (Number(formData.fromBaseId) === Number(formData.toBaseId)) {
      setError("Source and destination bases must be different");
      return;
    }

    if (Number(formData.quantity) <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/transfers", {
        fromBaseId: Number(formData.fromBaseId),
        toBaseId: Number(formData.toBaseId),
        equipmentTypeId: Number(formData.equipmentTypeId),
        quantity: Number(formData.quantity),
        description: formData.description,
      });

      setSuccess("Transfer recorded successfully");

      setFormData({
        fromBaseId: user?.baseId ? String(user.baseId) : "1",
        toBaseId: user?.baseId === 2 ? "1" : "2",
        equipmentTypeId: "1",
        quantity: "",
        description: "",
      });

      await fetchTransfers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record transfer");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTransfers = useMemo(() => {
    return transfers.filter((transfer) => {
      const equipmentMatch =
        !historyFilters.equipmentTypeId ||
        String(transfer.equipmentTypeId) ===
          String(historyFilters.equipmentTypeId);

      const transferDate = transfer.transferDate
        ? transfer.transferDate.substring(0, 10)
        : "";

      const startDateMatch =
        !historyFilters.startDate || transferDate >= historyFilters.startDate;

      const endDateMatch =
        !historyFilters.endDate || transferDate <= historyFilters.endDate;

      return equipmentMatch && startDateMatch && endDateMatch;
    });
  }, [transfers, historyFilters]);

  const canSelectSourceBase = user?.role === "ADMIN";

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Transfers</h1>
          <p>Transfer equipment between military bases</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {success && <div className="success-message">{success}</div>}

      <div className="form-card">
        <h2>Record Transfer</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Source Base</label>

              <select
                name="fromBaseId"
                value={formData.fromBaseId}
                onChange={handleChange}
                disabled={!canSelectSourceBase}
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
              <label>Destination Base</label>

              <select
                name="toBaseId"
                value={formData.toBaseId}
                onChange={handleChange}
                required
              >
                {baseOptions
                  .filter(
                    (base) => String(base.id) !== String(formData.fromBaseId),
                  )
                  .map((base) => (
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
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter transfer description"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={submitting}
          >
            {submitting ? "Recording..." : "Record Transfer"}
          </button>
        </form>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div>
            <h2>Transfer History</h2>
            <p>{filteredTransfers.length} record(s)</p>
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
          <div className="loading">Loading transfers...</div>
        ) : filteredTransfers.length === 0 ? (
          <div className="empty-state">No transfer records found.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>From Base</th>
                  <th>To Base</th>
                  <th>Equipment</th>
                  <th>Quantity</th>
                  <th>Date & Time</th>
                  <th>Description</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransfers.map((transfer) => (
                  <tr key={transfer.id}>
                    <td>{transfer.id}</td>

                    <td>{transfer.FromBase?.name || "Unknown"}</td>

                    <td>{transfer.ToBase?.name || "Unknown"}</td>

                    <td>{transfer.EquipmentType?.name || "Unknown"}</td>

                    <td>{transfer.quantity}</td>

                    <td>
                      {new Date(transfer.transferDate).toLocaleString("en-IN")}
                    </td>

                    <td>{transfer.description || "-"}</td>
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

export default Transfers;
