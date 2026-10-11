import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">EMS</span>
        <span className="sidebar-tagline">Employee Management</span>
      </div>
      <nav className="sidebar-nav">
        {isAdmin && (
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Dashboard
          </NavLink>
        )}
        <NavLink to="/employees" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Employees
        </NavLink>
        {isAdmin && (
          <NavLink to="/employees/new" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Add Employee
          </NavLink>
        )}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="user-name">{user?.name}</span>
          <span className="user-role">{user?.role}</span>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
