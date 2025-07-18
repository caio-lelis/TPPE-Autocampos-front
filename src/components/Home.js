import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// Ícones SVG aprimorados para os cards
const icons = {
  clientes: (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="card-icon">
      <circle cx="8" cy="8" r="4" fill="#FFD600" stroke="#111" strokeWidth="1.5"/>
      <circle cx="16" cy="8" r="4" fill="#FFD600" stroke="#111" strokeWidth="1.5"/>
      <rect x="2" y="16" width="8" height="6" rx="3" fill="#fffde7" stroke="#111" strokeWidth="1.5"/>
      <rect x="14" y="16" width="8" height="6" rx="3" fill="#fffde7" stroke="#111" strokeWidth="1.5"/>
    </svg>
  ),
  carros: (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="card-icon">
      <rect x="3" y="12" width="18" height="6" rx="2" fill="#FFD600" stroke="#111" strokeWidth="1.5"/>
      <circle cx="7" cy="19" r="2" fill="#111"/>
      <circle cx="17" cy="19" r="2" fill="#111"/>
    </svg>
  ),
  motos: (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="card-icon">
      <circle cx="7" cy="17" r="3" fill="#FFD600" stroke="#111" strokeWidth="1.5"/>
      <circle cx="17" cy="17" r="3" fill="#FFD600" stroke="#111" strokeWidth="1.5"/>
      <rect x="10" y="14" width="4" height="2" fill="#111"/>
      <rect x="11" y="10" width="2" height="4" fill="#111"/>
    </svg>
  ),
  vendas: (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="card-icon">
      <rect x="4" y="4" width="16" height="16" rx="4" fill="#FFD600" stroke="#111" strokeWidth="1.5"/>
      <path d="M8 16l3-4 2 2 3-4" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8" cy="16" r="1.5" fill="#111"/>
      <circle cx="13" cy="14" r="1.5" fill="#111"/>
      <circle cx="16" cy="10" r="1.5" fill="#111"/>
    </svg>
  ),
  anuncios: (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="card-icon">
      <rect x="3" y="4" width="18" height="16" rx="3" fill="#FFD600" stroke="#111" strokeWidth="1.5"/>
      <path d="M8 10h8M8 14h6" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  dashboard: (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="card-icon">
      <rect x="3" y="3" width="7" height="7" rx="2" fill="#FFD600" stroke="#111" strokeWidth="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="2" fill="#FFD600" stroke="#111" strokeWidth="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="2" fill="#FFD600" stroke="#111" strokeWidth="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="2" fill="#FFD600" stroke="#111" strokeWidth="1.5"/>
    </svg>
  )
};

// Mock de dados com mais informações
const mockData = {
  vendasFuncionario: 12,
  totalVendas: 120000,
  comissao: 6000,
  metaMensal: 15,
  clientesAtivos: 28,
  ultimaVenda: '2024-07-15'
};

function Home() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName] = useState('João Silva'); // Em uma implementação real, viria do contexto de autenticação

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const progressPercentage = (mockData.vendasFuncionario / mockData.metaMensal) * 100;

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="home-container">
      {/* Header aprimorado */}
      <nav className="home-navbar">
        <div className="container-fluid">
          <div className="navbar-content">
            <div className="navbar-brand">
              <img src="/logo.png" alt="AutoCampos Logo" className="navbar-logo" />
              <div className="brand-text">
                <span className="brand-title">AutoCampos</span>
                <span className="brand-subtitle">Painel do Funcionário</span>
              </div>
            </div>
            <div className="navbar-info">
              <div className="user-info">
                <span className="user-name">Olá, {userName}!</span>
                <span className="current-time">
                  {currentTime.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard principal */}
      <main className="home-main">
        <div className="container">
          {/* Seção de métricas principais */}
          <section className="metrics-section">
            <h2 className="section-title">Resumo de Performance</h2>
            <div className="row g-4">
              <div className="col-lg-3 col-md-6">
                <div className="metric-card sales-card">
                  <div className="metric-header">
                    <div className="metric-icon-container">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="metric-info">
                      <span className="metric-label">Vendas Realizadas</span>
                      <span className="metric-value">{mockData.vendasFuncionario}</span>
                    </div>
                  </div>
                  <div className="metric-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {Math.round(progressPercentage)}% da meta
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="metric-card revenue-card">
                  <div className="metric-header">
                    <div className="metric-icon-container">
                      <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="metric-info">
                      <span className="metric-label">Total em Vendas</span>
                      <span className="metric-value">
                        {mockData.totalVendas.toLocaleString('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL',
                          minimumFractionDigits: 0
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="metric-footer">
                    <small className="text-muted">
                      <i className="fas fa-arrow-up text-success"></i>
                      +12% vs. mês anterior
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="metric-card commission-card">
                  <div className="metric-header">
                    <div className="metric-icon-container">
                      <i className="fas fa-coins"></i>
                    </div>
                    <div className="metric-info">
                      <span className="metric-label">Comissão Recebida</span>
                      <span className="metric-value">
                        {mockData.comissao.toLocaleString('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="metric-footer">
                    <small className="text-muted">
                      5% sobre vendas
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="metric-card clients-card">
                  <div className="metric-header">
                    <div className="metric-icon-container">
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="metric-info">
                      <span className="metric-label">Clientes Ativos</span>
                      <span className="metric-value">{mockData.clientesAtivos}</span>
                    </div>
                  </div>
                  <div className="metric-footer">
                    <small className="text-muted">
                      +5 novos este mês
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seção de ações rápidas */}
          <section className="actions-section">
            <h2 className="section-title">Gerenciamento Rápido</h2>
            <div className="row g-4">
              <div className="col-lg-2 col-md-4 col-sm-6">
                <div 
                  className="action-card" 
                  onClick={() => handleCardClick('/clientes')}
                >
                  <div className="action-card-inner">
                    <div className="action-icon">
                      {icons.clientes}
                    </div>
                    <h3 className="action-title">Clientes</h3>
                    <p className="action-description">Gerenciar cadastros e informações</p>
                    <button className="action-button">
                      <span>Acessar</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-4 col-sm-6">
                <div 
                  className="action-card" 
                  onClick={() => handleCardClick('/carros')}
                >
                  <div className="action-card-inner">
                    <div className="action-icon">
                      {icons.carros}
                    </div>
                    <h3 className="action-title">Carros</h3>
                    <p className="action-description">Estoque e cadastro de veículos</p>
                    <button className="action-button">
                      <span>Acessar</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-4 col-sm-6">
                <div 
                  className="action-card" 
                  onClick={() => handleCardClick('/motos')}
                >
                  <div className="action-card-inner">
                    <div className="action-icon">
                      {icons.motos}
                    </div>
                    <h3 className="action-title">Motos</h3>
                    <p className="action-description">Gestão de motocicletas</p>
                    <button className="action-button">
                      <span>Acessar</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-4 col-sm-6">
                <div 
                  className="action-card" 
                  onClick={() => handleCardClick('/vendas')}
                >
                  <div className="action-card-inner">
                    <div className="action-icon">
                      {icons.vendas}
                    </div>
                    <h3 className="action-title">Vendas</h3>
                    <p className="action-description">Histórico e relatórios</p>
                    <button className="action-button">
                      <span>Acessar</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-4 col-sm-6">
                <div 
                  className="action-card" 
                  onClick={() => handleCardClick('/anuncios')}
                >
                  <div className="action-card-inner">
                    <div className="action-icon">
                      {icons.anuncios}
                    </div>
                    <h3 className="action-title">Anúncios</h3>
                    <p className="action-description">Publicações e promoções</p>
                    <button className="action-button">
                      <span>Acessar</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-4 col-sm-6">
                <div 
                  className="action-card" 
                  onClick={() => handleCardClick('/funcionarios')}
                >
                  <div className="action-card-inner">
                    <div className="action-icon">
                      {icons.dashboard}
                    </div>
                    <h3 className="action-title">Dashboard</h3>
                    <p className="action-description">Métricas detalhadas</p>
                    <button className="action-button">
                      <span>Acessar</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Home;
