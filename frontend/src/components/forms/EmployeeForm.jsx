import { useState, useEffect } from 'react';

const DEPARTMENTS = ['Engineering', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Product', 'Design'];

const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
};

const EMPTY_FORM = {
  name: '',
  email: '',
  department: '',
  designation: '',
  salary: '',
  joiningDate: '',
};

const EmployeeForm = ({ initialData, onSubmit, submitLabel }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        email: initialData.email || '',
        department: initialData.department || '',
        designation: initialData.designation || '',
        salary: initialData.salary?.toString() || '',
        joiningDate: formatDateForInput(initialData.joiningDate),
      });
    }
  }, [initialData]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.department) errs.department = 'Department is required';
    if (!form.designation.trim()) errs.designation = 'Designation is required';
    if (form.salary === '' || isNaN(Number(form.salary)) || Number(form.salary) < 0)
      errs.salary = 'Valid non-negative salary is required';
    if (!form.joiningDate) errs.joiningDate = 'Joining date is required';
    return errs;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setSubmitting(true);
    try {
      await onSubmit({ ...form, salary: Number(form.salary) });
    } catch (err) {
      const data = err.response?.data;
      if (data?.fields) {
        setErrors(data.fields);
      } else {
        setServerError(data?.error || 'Failed to save employee. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit} noValidate>
      {serverError && <div className="alert alert-error">{serverError}</div>}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="emp-name" className="form-label">Full name</label>
          <input
            id="emp-name"
            name="name"
            type="text"
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="emp-email" className="form-label">Email address</label>
          <input
            id="emp-email"
            name="email"
            type="email"
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="emp-department" className="form-label">Department</label>
          <select
            id="emp-department"
            name="department"
            className={`form-input ${errors.department ? 'input-error' : ''}`}
            value={form.department}
            onChange={handleChange}
          >
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.department && <span className="field-error">{errors.department}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="emp-designation" className="form-label">Designation</label>
          <input
            id="emp-designation"
            name="designation"
            type="text"
            className={`form-input ${errors.designation ? 'input-error' : ''}`}
            value={form.designation}
            onChange={handleChange}
          />
          {errors.designation && <span className="field-error">{errors.designation}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="emp-salary" className="form-label">Salary (₹)</label>
          <input
            id="emp-salary"
            name="salary"
            type="number"
            min="0"
            step="1000"
            className={`form-input ${errors.salary ? 'input-error' : ''}`}
            value={form.salary}
            onChange={handleChange}
          />
          {errors.salary && <span className="field-error">{errors.salary}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="emp-joiningDate" className="form-label">Joining date</label>
          <input
            id="emp-joiningDate"
            name="joiningDate"
            type="date"
            className={`form-input ${errors.joiningDate ? 'input-error' : ''}`}
            value={form.joiningDate}
            onChange={handleChange}
          />
          {errors.joiningDate && <span className="field-error">{errors.joiningDate}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
