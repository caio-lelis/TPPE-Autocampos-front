import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow p-4" style={{ maxWidth: 400, width: "100%" }}>
        <h2 className="mb-3 text-center">Bem-vindo à AutoCampos!</h2>
        <p className="text-center mb-4">Escolha uma opção abaixo:</p>
        <div className="d-grid gap-3">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/anuncios')}
          >
            Gerenciar Anúncios
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/funcionario')}
          >
            Gerenciar Funcionários
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;