import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="error-page">
    <h1 className="error-code">404</h1>
    <p className="error-message">Page not found.</p>
    <Link to="/employees" className="btn btn-primary">
      Go to employees
    </Link>
  </div>
);

export default NotFoundPage;
