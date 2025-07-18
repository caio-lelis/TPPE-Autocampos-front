import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FiLogOut } from 'react-icons/fi';

function Header({ autenticado, userType, setAutenticado, setUserType }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setAutenticado(false);
    setUserType(null);
    navigate('/home_geral');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top" style={{ zIndex: 3000 }}>
      <div className="container">
        <button type="button" className="navbar-brand btn btn-link text-warning fw-bold p-0" onClick={() => navigate('/home_geral')} style={{ cursor: 'pointer', textDecoration: 'none' }}>
          AutoCampos
        </button>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!autenticado && (
              <>  
                <li className="nav-item">
                  <button type="button" className="nav-link btn btn-link text-light" onClick={() => navigate('/home_geral')}>Home</button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link btn btn-link text-light" onClick={() => navigate('/login')}>Login</button>
                </li>
              </>
            )}
            {autenticado && userType === 'funcionario' && (
              <>  
                <li className="nav-item">
                  <button type="button" className="nav-link btn btn-link text-light" onClick={() => navigate('/home')}>Home</button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link btn btn-link text-light" onClick={() => navigate('/anuncios-admin')}>Anúncios</button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link btn btn-link text-light" onClick={() => navigate('/clientes')}>Clientes</button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link btn btn-link text-light" onClick={() => navigate('/carros')}>Carros</button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link btn btn-link text-light" onClick={() => navigate('/motos')}>Motos</button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link btn btn-link text-light" onClick={() => navigate('/vendas')}>Vendas</button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link btn btn-link text-danger" onClick={handleLogout}>Sair</button>
                </li>
              </>
            )}
            {autenticado && userType === 'admin' && (
              <>  
                <li className="nav-item">
                  <button type="button" className="nav-link btn btn-link text-light" onClick={() => navigate('/home')}>Home</button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link btn btn-link text-light" onClick={() => navigate('/usuarios')}>Usuários</button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link btn btn-link text-light" onClick={() => navigate('/funcionarios')}>Funcionários</button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link btn btn-link text-light" onClick={() => navigate('/clientes')}>Clientes</button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link btn btn-link text-light" onClick={() => navigate('/carros')}>Carros</button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link btn btn-link text-light" onClick={() => navigate('/motos')}>Motos</button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link btn btn-link text-light" onClick={() => navigate('/vendas')}>Vendas</button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link btn btn-link text-danger d-flex align-items-center" onClick={handleLogout}>
                    <FiLogOut style={{ marginRight: 4, color: '#FFD600' }} />Sair
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
