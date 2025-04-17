import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <div className="text-center">
        <h1>Welcome to Finance Tracker</h1>
        <p className="lead">Track your income and expenses with ease</p>
        
        <div className="mt-4">
          <button 
            className="btn btn-primary me-3"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button 
            className="btn btn-outline-primary"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;