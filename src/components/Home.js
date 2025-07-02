import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Cabeçalho */}
      <header style={{
        backgroundColor: '#2a5298',
        color: 'white',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
       Shadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{ margin: 0 }}>Painel Administrativo - AutoCampos</h2>
        <span style={{ fontSize: 14 }}>Bem-vindo, funcionário</span>
      </header>

      {/* Conteúdo */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm p-4 border-0">
              <h3 className="text-center mb-4" style={{ color: '#2a5298' }}>Escolha uma opção</h3>
              <div className="d-grid gap-3">
                <button
                  className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                  onClick={() => navigate('/anuncios')}
                >
                  <i className="bi bi-megaphone-fill"></i>
                  Gerenciar Anúncios
                </button>
                <button
                  className="btn btn-secondary d-flex align-items-center justify-content-center gap-2"
                  onClick={() => navigate('/funcionario')}
                >
                  <i className="bi bi-people-fill"></i>
                  Gerenciar Funcionários
                </button>
                <button
                  className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                  onClick={() => navigate('/anuncios')}
                >
                  <i className="bi bi-megaphone-fill"></i>
                  Gerenciar Carros
                </button>

                <button
                  className="btn btn-secondary d-flex align-items-center justify-content-center gap-2"
                  onClick={() => navigate('/anuncios')}
                >
                  <i className="bi bi-people-fill"></i>
                  Gerenciar Motos
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
