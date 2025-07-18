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
  )
};

function Home() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName] = useState('João Silva'); // Em uma implementação real, viria do contexto de autenticação
  const [funcionarioId] = useState(1); // ID do funcionário logado - deve vir do contexto de autenticação
  const [metricsData, setMetricsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [funcionarioId]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/home/funcionario/${funcionarioId}/metrics`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMetricsData(data);
    } catch (e) {
      setError("Falha ao carregar métricas: " + e.message);
      console.error("Erro ao buscar métricas:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3">Carregando painel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error-container">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Erro!</h4>
            <p>{error}</p>
            <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Header aprimorado */}
      <nav className="home-navbar">
        <div className="container-fluid">
          <div className="navbar-content">
            <div className="navbar-brand">
              <img src="/logo.png" alt="AutoCampos Logo" className="navbar-logo" />
              <div className="brand-text">
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
                      <span className="metric-value">{metricsData?.total_vendas || 0}</span>
                    </div>
                  </div>
                  <div className="metric-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${Math.min(metricsData?.progresso_meta || 0, 100)}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {Math.round(metricsData?.progresso_meta || 0)}% da meta
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
                        {(metricsData?.valor_total || 0).toLocaleString('pt-BR', { 
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
                      Baseado em {metricsData?.total_vendas || 0} vendas
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
                        {(metricsData?.comissao_total || 0).toLocaleString('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="metric-footer">
                    <small className="text-muted">
                      Sobre vendas realizadas
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
                      <span className="metric-value">{metricsData?.clientes_ativos || 0}</span>
                    </div>
                  </div>
                  <div className="metric-footer">
                    <small className="text-muted">
                      Clientes únicos atendidos
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
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Home;
