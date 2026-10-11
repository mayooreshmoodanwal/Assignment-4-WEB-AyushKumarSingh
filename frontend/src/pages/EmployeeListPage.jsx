import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { employeeService } from '../services/employeeService';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import useDebounce from '../hooks/useDebounce';

const DEPARTMENTS = ['Engineering', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Product', 'Design'];

const EmployeeListPage = () => {
  const { isAdmin } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const fetchEmployees = useCallback(() => {
    setLoading(true);
    setError('');
    const params = { page, limit: 10 };
    if (debouncedSearch) params.search = debouncedSearch;
    if (department) params.department = department;

    employeeService
      .getAll(params)
      .then(({ employees, pagination }) => {
        setEmployees(employees);
        setPagination(pagination);
      })
      .catch(() => setError('Failed to load employees.'))
      .finally(() => setLoading(false));
  }, [page, debouncedSearch, department]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, department]);

  const handleDelete = async (id) => {
    try {
      await employeeService.remove(id);
      setDeleteTarget(null);
      fetchEmployees();
    } catch {
      setError('Failed to delete employee.');
    }
  };

  return (
    <AppLayout>
      <div className="page-header">
        <h2 className="page-title">Employees</h2>
        {isAdmin && (
          <Link to="/employees/new" className="btn btn-primary">
            Add Employee
          </Link>
        )}
      </div>

      <div className="filters-bar">
        <input
          type="text"
          className="form-input search-input"
          placeholder="Search by name, email or designation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search employees"
        />
        <select
          className="form-input"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          aria-label="Filter by department"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading employees...</div>
      ) : employees.length === 0 ? (
        <div className="empty-state">
          <p>No employees found{search || department ? ' matching your filters' : ''}.</p>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Joining Date</th>
                  {isAdmin && <th>Salary</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.department}</td>
                    <td>{emp.designation}</td>
                    <td>{new Date(emp.joiningDate).toLocaleDateString()}</td>
                    {isAdmin && <td>₹{emp.salary?.toLocaleString()}</td>}
                    <td className="actions-cell">
                      <Link to={`/employees/${emp._id}`} className="btn-link">View</Link>
                      {isAdmin && (
                        <>
                          <Link to={`/employees/${emp._id}/edit`} className="btn-link">Edit</Link>
                          <button
                            className="btn-link btn-danger"
                            onClick={() => setDeleteTarget(emp)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination.page} of {pagination.totalPages} &mdash; {pagination.total} total
              </span>
              <button
                className="btn btn-secondary"
                disabled={page === pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {deleteTarget && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="modal">
            <h3 id="confirm-title" className="modal-title">Confirm Deletion</h3>
            <p>
              Delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteTarget._id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default EmployeeListPage;
