import './welcomeSection.css';

function welcomeSection({ firstName, lastName }) {
  return (
    <div className="welcome-container">
      <h2>Bienvenido, <strong>{firstName} {lastName}</strong></h2>
      <p>Estas son las posiciones disponibles para postulación.</p>
    </div>
  );
}

export default welcomeSection;