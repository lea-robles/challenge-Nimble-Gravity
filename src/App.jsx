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
    if (!url) return alert("Por favor, ingresa la URL de tu repositorio");
    if (!candidate) return alert("Error: Datos del candidato no cargados");

    // Fuerzo String por error al intentar submit
    const payload = {
      uuid: candidate.uuid,
      jobId: String(jobId),
      candidateId: String(candidate.candidateId),
      applicationId: candidate.applicationId, // Agregue este que es el que pide el error
      repoUrl: url.trim()
    };

    console.log("Enviando postulación exacta:", payload);

    try {
      const response = await fetch('https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net/api/candidate/apply-to-job', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        alert("¡Postulación enviada con éxito!");
      } else {
        console.error("Error de la API:", result);
        alert("Error: " + (result.message || "Datos incorrectos o ya postulado"));
      }
    } catch (error) {
      alert("Error de red. Verifica tu conexión.");
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