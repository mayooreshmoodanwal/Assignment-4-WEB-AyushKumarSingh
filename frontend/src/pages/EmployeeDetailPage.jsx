import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { employeeService } from '../services/employeeService';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    employeeService
      .getById(id)
      .then(({ employee }) => setEmployee(employee))
      .catch((err) => {
        if (err.response?.status === 404) setError('Employee not found.');
        else setError('Failed to load employee details.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    try {
      await employeeService.remove(id);
      navigate('/employees');
    } catch {
      setError('Failed to delete employee.');
    }
  };

  return (
    <AppLayout>
      <div className="page-header">
        <h2 className="page-title">Employee Details</h2>
        <Link to="/employees" className="btn btn-secondary">
          Back to list
        </Link>
      </div>

      {loading && <div className="loading-state">Loading...</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {employee && (
        <div className="detail-card">
          <div className="detail-grid">
            <div className="detail-field">
              <span className="detail-label">Name</span>
              <span className="detail-value">{employee.name}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Email</span>
              <span className="detail-value">{employee.email}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Department</span>
              <span className="detail-value">{employee.department}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Designation</span>
              <span className="detail-value">{employee.designation}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Joining Date</span>
              <span className="detail-value">{new Date(employee.joiningDate).toLocaleDateString()}</span>
            </div>
            {isAdmin && (
              <div className="detail-field">
                <span className="detail-label">Salary</span>
                <span className="detail-value">₹{employee.salary?.toLocaleString()}</span>
              </div>
            )}
            <div className="detail-field">
              <span className="detail-label">Added on</span>
              <span className="detail-value">{new Date(employee.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          {isAdmin && (
            <div className="detail-actions">
              <Link to={`/employees/${id}/edit`} className="btn btn-primary">
                Edit
              </Link>
              <button className="btn btn-danger" onClick={() => setDeleteConfirm(true)}>
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-del-title">
          <div className="modal">
            <h3 id="confirm-del-title" className="modal-title">Confirm Deletion</h3>
            <p>Delete <strong>{employee?.name}</strong>? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default EmployeeDetailPage;
