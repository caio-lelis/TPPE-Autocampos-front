import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeAdmin.css';

// Ícones SVG para os cards do admin
const adminIcons = {
  vendas: (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="card-icon">
      <rect x="4" y="4" width="16" height="16" rx="4" fill="#FFD600" stroke="#111" strokeWidth="1.5"/>
      <path d="M8 16l3-4 2 2 3-4" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8" cy="16" r="1.5" fill="#111"/>
      <circle cx="13" cy="14" r="1.5" fill="#111"/>
      <circle cx="16" cy="10" r="1.5" fill="#111"/>
    </svg>
  ),
  funcionarios: (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="card-icon">
      <circle cx="12" cy="8" r="4" fill="#FFD600" stroke="#111" strokeWidth="1.5"/>
      <rect x="4" y="16" width="16" height="6" rx="3" fill="#fffde7" stroke="#111" strokeWidth="1.5"/>
    </svg>
  ),
  clientes: (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="card-icon">
      <circle cx="8" cy="8" r="4" fill="#FFD600" stroke="#111" strokeWidth="1.5"/>
      <circle cx="16" cy="8" r="4" fill="#FFD600" stroke="#111" strokeWidth="1.5"/>
      <rect x="2" y="16" width="8" height="6" rx="3" fill="#fffde7" stroke="#111" strokeWidth="1.5"/>
      <rect x="14" y="16" width="8" height="6" rx="3" fill="#fffde7" stroke="#111" strokeWidth="1.5"/>
    </svg>
  ),
  veiculos: (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="card-icon">
      <rect x="3" y="12" width="18" height="6" rx="2" fill="#FFD600" stroke="#111" strokeWidth="1.5"/>
      <circle cx="7" cy="19" r="2" fill="#111"/>
      <circle cx="17" cy="19" r="2" fill="#111"/>
    </svg>
  ),
  anuncios: (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="card-icon">
      <rect x="3" y="4" width="18" height="16" rx="3" fill="#FFD600" stroke="#111" strokeWidth="1.5"/>
      <path d="M8 10h8M8 14h6" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  usuarios: (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="card-icon">
      <circle cx="12" cy="8" r="4" fill="#FFD600" stroke="#111" strokeWidth="1.5"/>
      <path d="M8 16s2-2 4-2 4 2 4 2" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  concessionarias: (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="card-icon">
      <rect x="2" y="8" width="20" height="12" rx="2" fill="#FFD600" stroke="#111" strokeWidth="1.5"/>
      <rect x="6" y="4" width="12" height="4" rx="2" fill="#fffde7" stroke="#111" strokeWidth="1.5"/>
    </svg>
  )
};

function HomeAdmin() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [adminName] = useState('Administrador'); // Em uma implementação real, viria do contexto de autenticação
  const [metricsData, setMetricsData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Buscar métricas e dashboard em paralelo
      const [metricsResponse, dashboardResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/admin/metrics`),
        fetch(`${API_BASE_URL}/api/v1/admins/dashboard`)
      ]);

      if (!metricsResponse.ok || !dashboardResponse.ok) {
        throw new Error('Erro ao carregar dados');
      }

      const metrics = await metricsResponse.json();
      const dashboard = await dashboardResponse.json();

      setMetricsData(metrics);
      setDashboardData(dashboard);
    } catch (e) {
      setError("Falha ao carregar dados: " + e.message);
      console.error("Erro ao buscar dados:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="home-admin-container">
        <div className="admin-loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-admin-container">
        <div className="admin-error-container">
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
    <div className="home-admin-container">
      {/* Header do admin */}
      <nav className="home-admin-navbar">
        <div className="container-fluid">
          <div className="admin-navbar-content">
            <div className="admin-navbar-brand">
              <img src="/logo.png" alt="AutoCampos Logo" className="admin-navbar-logo" />
              <div className="admin-brand-text">
                <span className="admin-brand-title">AutoCampos</span>
                <span className="admin-brand-subtitle">Painel Administrativo</span>
              </div>
            </div>
            <div className="admin-navbar-info">
              <div className="admin-user-info">
                <span className="admin-user-name">Olá, {adminName}!</span>
                <span className="admin-current-time">
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
      <main className="home-admin-main">
        <div className="container">
          {/* Seção de métricas principais */}
          <section className="admin-metrics-section">
            <h2 className="admin-section-title">Visão Geral do Negócio</h2>
            <div className="row g-4">
              <div className="col-lg-3 col-md-6">
                <div className="admin-metric-card">
                  <div className="admin-metric-header">
                    <div className="admin-metric-icon-container">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="admin-metric-info">
                      <span className="admin-metric-label">Total de Vendas</span>
                      <span className="admin-metric-value">{metricsData?.total_vendas || 0}</span>
                    </div>
                  </div>
                  <div className="admin-metric-footer">
                    <small className="text-muted">
                      {metricsData?.vendas_carros || 0} carros e {metricsData?.vendas_motos || 0} motos
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="admin-metric-card">
                  <div className="admin-metric-header">
                    <div className="admin-metric-icon-container">
                      <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="admin-metric-info">
                      <span className="admin-metric-label">Receita Total</span>
                      <span className="admin-metric-value">
                        {(metricsData?.valor_total_vendas || 0).toLocaleString('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL',
                          minimumFractionDigits: 0
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="admin-metric-footer">
                    <small className="text-muted">
                      <i className="fas fa-arrow-up text-success"></i>
                      Baseado em {metricsData?.total_vendas || 0} vendas
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="admin-metric-card">
                  <div className="admin-metric-header">
                    <div className="admin-metric-icon-container">
                      <i className="fas fa-coins"></i>
                    </div>
                    <div className="admin-metric-info">
                      <span className="admin-metric-label">Comissões Pagas</span>
                      <span className="admin-metric-value">
                        {(metricsData?.comissao_total || 0).toLocaleString('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="admin-metric-footer">
                    <small className="text-muted">
                      Para {metricsData?.total_funcionarios || 0} funcionários
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="admin-metric-card">
                  <div className="admin-metric-header">
                    <div className="admin-metric-icon-container">
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="admin-metric-info">
                      <span className="admin-metric-label">Clientes Ativos</span>
                      <span className="admin-metric-value">{metricsData?.total_clientes || 0}</span>
                    </div>
                  </div>
                  <div className="admin-metric-footer">
                    <small className="text-muted">
                      Total de clientes registrados
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seção de inventário */}
          <section className="admin-metrics-section">
            <h2 className="admin-section-title">Inventário</h2>
            <div className="row g-4">
              <div className="col-lg-3 col-md-6">
                <div className="admin-metric-card">
                  <div className="admin-metric-header">
                    <div className="admin-metric-icon-container">
                      <i className="fas fa-car"></i>
                    </div>
                    <div className="admin-metric-info">
                      <span className="admin-metric-label">Carros em Estoque</span>
                      <span className="admin-metric-value">{metricsData?.total_carros || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="admin-metric-card">
                  <div className="admin-metric-header">
                    <div className="admin-metric-icon-container">
                      <i className="fas fa-motorcycle"></i>
                    </div>
                    <div className="admin-metric-info">
                      <span className="admin-metric-label">Motos em Estoque</span>
                      <span className="admin-metric-value">{metricsData?.total_motos || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="admin-metric-card">
                  <div className="admin-metric-header">
                    <div className="admin-metric-icon-container">
                      <i className="fas fa-bullhorn"></i>
                    </div>
                    <div className="admin-metric-info">
                      <span className="admin-metric-label">Anúncios Ativos</span>
                      <span className="admin-metric-value">{metricsData?.anuncios_ativos || 0}</span>
                    </div>
                  </div>
                  <div className="admin-metric-footer">
                    <small className="text-muted">
                      De {metricsData?.total_anuncios || 0} total
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="admin-metric-card">
                  <div className="admin-metric-header">
                    <div className="admin-metric-icon-container">
                      <i className="fas fa-user-tie"></i>
                    </div>
                    <div className="admin-metric-info">
                      <span className="admin-metric-label">Funcionários</span>
                      <span className="admin-metric-value">{metricsData?.total_funcionarios || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Gráfico de vendas */}
          {dashboardData?.grafico && (
            <section className="admin-chart-section">
              <h2 className="admin-section-title">Análise de Vendas</h2>
              <div className="admin-chart-container">
                <img src={dashboardData.grafico} alt="Gráfico Vendas Carros vs Motos" />
              </div>
            </section>
          )}

          {/* Tabela de funcionários */}
          <section className="admin-table-section">
            <h2 className="admin-section-title">Funcionários: Salário e Comissão</h2>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Salário</th>
                    <th>Comissão Total</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.metricas?.funcionarios?.map(f => (
                    <tr key={f.funcionario_id}>
                      <td>{f.funcionario_id}</td>
                      <td>{f.nome}</td>
                      <td>{f.salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td>{f.comissao_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan="4" className="text-center">Carregando dados...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Seção de ações rápidas */}
          <section className="admin-actions-section">
            <h2 className="admin-section-title">Gerenciamento do Sistema</h2>
            <div className="row g-4">
              <div className="col-lg-2 col-md-4 col-sm-6">
                <div 
                  className="admin-action-card" 
                  onClick={() => handleCardClick('/funcionarios')}
                >
                  <div className="admin-action-card-inner">
                    <div className="admin-action-icon">
                      {adminIcons.funcionarios}
                    </div>
                    <h3 className="admin-action-title">Funcionários</h3>
                    <p className="admin-action-description">Gerenciar equipe e dados</p>
                    <button className="admin-action-button">
                      <span>Acessar</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-4 col-sm-6">
                <div 
                  className="admin-action-card" 
                  onClick={() => handleCardClick('/clientes')}
                >
                  <div className="admin-action-card-inner">
                    <div className="admin-action-icon">
                      {adminIcons.clientes}
                    </div>
                    <h3 className="admin-action-title">Clientes</h3>
                    <p className="admin-action-description">Base de clientes</p>
                    <button className="admin-action-button">
                      <span>Acessar</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-4 col-sm-6">
                <div 
                  className="admin-action-card" 
                  onClick={() => handleCardClick('/vendas')}
                >
                  <div className="admin-action-card-inner">
                    <div className="admin-action-icon">
                      {adminIcons.vendas}
                    </div>
                    <h3 className="admin-action-title">Vendas</h3>
                    <p className="admin-action-description">Histórico e relatórios</p>
                    <button className="admin-action-button">
                      <span>Acessar</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-4 col-sm-6">
                <div 
                  className="admin-action-card" 
                  onClick={() => handleCardClick('/usuarios')}
                >
                  <div className="admin-action-card-inner">
                    <div className="admin-action-icon">
                      {adminIcons.usuarios}
                    </div>
                    <h3 className="admin-action-title">Usuários</h3>
                    <p className="admin-action-description">Controle de acesso</p>
                    <button className="admin-action-button">
                      <span>Acessar</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-4 col-sm-6">
                <div 
                  className="admin-action-card" 
                  onClick={() => handleCardClick('/anuncios')}
                >
                  <div className="admin-action-card-inner">
                    <div className="admin-action-icon">
                      {adminIcons.anuncios}
                    </div>
                    <h3 className="admin-action-title">Anúncios</h3>
                    <p className="admin-action-description">Publicações ativas</p>
                    <button className="admin-action-button">
                      <span>Acessar</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-4 col-sm-6">
                <div 
                  className="admin-action-card" 
                  onClick={() => handleCardClick('/concessionarias')}
                >
                  <div className="admin-action-card-inner">
                    <div className="admin-action-icon">
                      {adminIcons.concessionarias}
                    </div>
                    <h3 className="admin-action-title">Concessionárias</h3>
                    <p className="admin-action-description">Parceiros e filiais</p>
                    <button className="admin-action-button">
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

export default HomeAdmin;
