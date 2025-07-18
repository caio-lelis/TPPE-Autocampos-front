import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AnunciosPublicos from './AnunciosPublicos';

function Home_geral() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Banner */}
      <div className="container-fluid p-0 mb-4">
        <div style={{
          background: 'linear-gradient(90deg, #FFD600 0%, #FFC107 100%)',
          color: '#111',
          padding: '40px 0 20px 0',
          position: 'relative',
          minHeight: 240,
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
          borderBottom: '8px solid #111',
        }}>
          {/* Botão login fixo no canto superior direito */}
          <button
            onClick={() => navigate('/login')}
            className="btn fw-bold px-4 py-2"
            style={{
              position: 'fixed',
              top: 48,
              right: 20,
              background: '#111',
              color: '#FFD600',
              borderRadius: 8,
              border: 'none',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
              zIndex: 2000,
              margin: 0
            }}
          >
            Login
          </button>
          {/* Logo centralizada */}
          <div className="w-100 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 120 }}>
            <img src="/logo.png" alt="AutoCampos Logo" style={{ maxHeight: 110, maxWidth: '90%', objectFit: 'contain', marginBottom: 8 }} />
            <p className="w-100 text-center" style={{ fontSize: 20, fontWeight: 400, marginBottom: 0 }}>Sua loja de carros e motos seminovos</p>
          </div>
        </div>
      </div>

      {/* Seção principal com anúncios reais */}
      <AnunciosPublicos />
      
      {/* Footer */}
      <footer className="text-center py-4" style={{ background: '#111', color: '#FFD600', marginTop: 40, borderTop: '4px solid #FFD600' }}>
        <div className="container">
          <p className="mb-0">&copy; 2024 AutoCampos. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home_geral;
