import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { employeeService } from '../services/employeeService';
import AppLayout from '../components/layout/AppLayout';
import EmployeeForm from '../components/forms/EmployeeForm';

const EmployeeFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    employeeService
      .getById(id)
      .then(({ employee }) => setInitialData(employee))
      .catch(() => setError('Failed to load employee data.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSubmit = async (formData) => {
    if (isEdit) {
      await employeeService.update(id, formData);
    } else {
      await employeeService.create(formData);
    }
    navigate('/employees');
  };

  return (
    <AppLayout>
      <div className="page-header">
        <h2 className="page-title">{isEdit ? 'Edit Employee' : 'Add Employee'}</h2>
        <Link to="/employees" className="btn btn-secondary">
          Cancel
        </Link>
      </div>
      {loading && <div className="loading-state">Loading employee data...</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {!loading && (
        <EmployeeForm
          initialData={initialData}
          onSubmit={handleSubmit}
          submitLabel={isEdit ? 'Save changes' : 'Add employee'}
        />
      )}
    </AppLayout>
  );
};

export default EmployeeFormPage;
