import { useState, useEffect } from 'react';
import { employeeService } from '../services/employeeService';
import AppLayout from '../components/layout/AppLayout';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    employeeService
      .getStats()
      .then(setStats)
      .catch(() => setError('Failed to load dashboard statistics.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
      </div>
      {loading && <div className="loading-state">Loading statistics...</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{stats.totalEmployees}</span>
              <span className="stat-label">Total Employees</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.totalDepartments}</span>
              <span className="stat-label">Departments</span>
            </div>
          </div>
          {stats.recentEmployees.length > 0 && (
            <div className="section">
              <h3 className="section-title">Recently Added</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Joining Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentEmployees.map((emp) => (
                    <tr key={emp._id}>
                      <td>{emp.name}</td>
                      <td>{emp.department}</td>
                      <td>{emp.designation}</td>
                      <td>{new Date(emp.joiningDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {stats.departments.length > 0 && (
            <div className="section">
              <h3 className="section-title">Department Breakdown</h3>
              <div className="dept-list">
                {stats.departments.map((d) => (
                  <div key={d._id} className="dept-item">
                    <span className="dept-name">{d._id}</span>
                    <span className="dept-count">{d.count} {d.count === 1 ? 'employee' : 'employees'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </AppLayout>
  );
};

export default DashboardPage;
