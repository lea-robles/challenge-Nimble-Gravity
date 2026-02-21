import { useState } from 'react';
import Button from '../Button/Button'; 
import './JobCard.css';

function JobCard({ job, onSubmit }) {
  const [repoUrl, setRepoUrl] = useState("");

  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p>ID: {job.id}</p>
      <div className="input-group">
        <input 
          type="text" 
          placeholder="URL del repositorio" 
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
        <Button onClick={() => onSubmit(job.id, repoUrl)}>
          Submit
        </Button>
      </div>
    </div>
  );
}

export default JobCard;