import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import WelcomeSection from './components/WelcomeSection/WelcomeSection';
import JobCard from './components/JobCard/JobCard';
import './App.css';

function App() {
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const EMAIL = "learobles75@gmail.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Se ejecuta ambas peticiones en paralelo para ganar velocidad
        const [resCand, resJobs] = await Promise.all([
          fetch(`https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net/api/candidate/get-by-email?email=${EMAIL}`),
          fetch(`https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net/api/jobs/get-list`)
        ]);

        const dataCand = await resCand.json();
        const dataJobs = await resJobs.json();

        setCandidate(dataCand);
        setJobs(dataJobs);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApply = async (jobId, url) => {
    // Validación de URL
    if (!url) return alert("Por favor, ingresa la URL de tu repositorio");
    
    // Validación de seguridad para evitar errores de 'null'
    if (!candidate) return alert("Error: Datos del candidato no cargados");

    const payload = {
      uuid: candidate.uuid,
      jobId: jobId,
      candidateId: candidate.candidateId,
      repoUrl: url
    };

    try {
      const response = await fetch('https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net/api/candidate/apply-to-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // La API a veces devuelve un objeto con .ok o directamente el resultado
      const result = await response.json();
      
      if (response.ok || result.ok) {
        alert("¡Postulación enviada con éxito!");
      } else {
        alert("Error: " + (result.message || "No se pudo enviar la postulación"));
      }
    } catch (error) {
      alert("Error de red: Intenta nuevamente.");
      console.error(error);
    }
  };

  if (loading) return <div className="loader">Cargando...</div>;

  return (
    <div className="app-wrapper">
      <Header />
      
      <div className="container">
        {candidate && (
          <WelcomeSection 
            firstName={candidate.firstName} 
            lastName={candidate.lastName} 
          />
        )}

        <main className="jobs-grid">
          {jobs.length > 0 ? (
            jobs.map(job => (
              <JobCard key={job.id} job={job} onSubmit={handleApply} />
            ))
          ) : (
            <p>No hay posiciones disponibles en este momento.</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;