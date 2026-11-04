import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="pf-page text-center">
      <div className="container">
        <div className="display-1 fw-bold text-gradient font-display">404</div>
        <p className="lead text-muted-2">La página que buscás no existe.</p>
        <Link to="/" className="btn btn-primary rounded-pill">Volver al inicio</Link>
      </div>
    </div>
  );
}
