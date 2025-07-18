import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FuncionarioDashboard.css';

function FuncionarioDashboard() {
    const { id } = useParams(); // ID do funcionário
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    useEffect(() => {
        fetchDashboardData(id);
    }, [id]);

    const fetchDashboardData = async (funcionarioId) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/v1/funcionarios/${funcionarioId}/dashboard`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setDashboardData(data);
        } catch (e) {
            setError("Falha ao carregar dashboard: " + e.message);
            console.error("Erro ao buscar dados do dashboard:", e);
        } finally {
            setLoading(false);
        }
    };

    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
        // Aqui você pode implementar lógica para recarregar dados baseado no período
    };

    const handleNewAnnouncement = () => {
        navigate('/anuncios/create');
    };

    const handleViewSales = () => {
        navigate('/vendas');
    };

    const handleViewVehicles = () => {
        navigate('/veiculos');
    };

    if (loading) return (
        <div className="dashboard-container">
            <div className="loading-spinner">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="mt-3">Carregando dashboard...</p>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="dashboard-container">
            <div className="error-container">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Erro!</h4>
                    <p>{error}</p>
                    <button className="btn btn-outline-danger" onClick={() => navigate('/funcionarios')}>
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
    
    if (!dashboardData) return (
        <div className="dashboard-container">
            <div className="no-data-container">
                <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
                <p>Nenhum dado de dashboard disponível.</p>
            </div>
        </div>
    );

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <h1 className="dashboard-title">
                                <i className="fas fa-tachometer-alt me-3"></i>
                                Dashboard Funcionário
                            </h1>
                            <p className="dashboard-subtitle">
                                ID: {dashboardData.funcionario_id} | {new Date().toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                        <div className="col-md-6">
                            <div className="dashboard-actions">
                                <button
                                    className="btn btn-primary me-2"
                                    onClick={handleNewAnnouncement}
                                >
                                    <i className="fas fa-plus me-2"></i>
                                    Novo Anúncio
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate('/funcionarios')}
                                >
                                    <i className="fas fa-arrow-left me-2"></i>
                                    Voltar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="container-fluid">
                    {/* Period Selector */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="period-selector">
                                <button
                                    className={`btn ${selectedPeriod === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => handlePeriodChange('week')}
                                >
                                    Semana
                                </button>
                                <button
                                    className={`btn ${selectedPeriod === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => handlePeriodChange('month')}
                                >
                                    Mês
                                </button>
                                <button
                                    className={`btn ${selectedPeriod === 'year' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => handlePeriodChange('year')}
                                >
                                    Ano
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Métricas Cards */}
                    <div className="row mb-4">
                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="metric-card sales-card">
                                <div className="metric-icon">
                                    <i className="fas fa-car"></i>
                                </div>
                                <div className="metric-content">
                                    <h3 className="metric-title">Carros Vendidos</h3>
                                    <p className="metric-value">{dashboardData.metricas.total_carros_vendidos}</p>
                                    <span className="metric-change positive">
                                        <i className="fas fa-arrow-up"></i> +12%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="metric-card commission-card">
                                <div className="metric-icon">
                                    <i className="fas fa-dollar-sign"></i>
                                </div>
                                <div className="metric-content">
                                    <h3 className="metric-title">Comissões</h3>
                                    <p className="metric-value">R$ {parseFloat(dashboardData.metricas.total_comissoes).toFixed(2)}</p>
                                    <span className="metric-change positive">
                                        <i className="fas fa-arrow-up"></i> +8%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="metric-card target-card">
                                <div className="metric-icon">
                                    <i className="fas fa-target"></i>
                                </div>
                                <div className="metric-content">
                                    <h3 className="metric-title">Meta do Mês</h3>
                                    <p className="metric-value">75%</p>
                                    <span className="metric-change neutral">
                                        <i className="fas fa-minus"></i> Meta
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="metric-card rating-card">
                                <div className="metric-icon">
                                    <i className="fas fa-star"></i>
                                </div>
                                <div className="metric-content">
                                    <h3 className="metric-title">Avaliação</h3>
                                    <p className="metric-value">4.8</p>
                                    <span className="metric-change positive">
                                        <i className="fas fa-arrow-up"></i> Excelente
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts and Quick Actions */}
                    <div className="row">
                        <div className="col-lg-8 mb-4">
                            <div className="chart-container">
                                <div className="chart-header">
                                    <h3 className="chart-title">
                                        <i className="fas fa-chart-line me-2"></i>
                                        Vendas por Período
                                    </h3>
                                    <div className="chart-actions">
                                        <button className="btn btn-sm btn-outline-primary">
                                            <i className="fas fa-download"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="chart-content">
                                    {dashboardData.grafico ? (
                                        <img 
                                            src={dashboardData.grafico} 
                                            alt="Gráfico de Vendas" 
                                            className="chart-image"
                                        />
                                    ) : (
                                        <div className="chart-placeholder">
                                            <i className="fas fa-chart-bar fa-3x text-muted mb-3"></i>
                                            <p className="text-muted">Gráfico não disponível</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 mb-4">
                            <div className="quick-actions-container">
                                <h3 className="quick-actions-title">
                                    <i className="fas fa-bolt me-2"></i>
                                    Ações Rápidas
                                </h3>
                                <div className="quick-actions">
                                    <button 
                                        className="quick-action-btn"
                                        onClick={handleViewSales}
                                    >
                                        <i className="fas fa-handshake"></i>
                                        <span>Ver Vendas</span>
                                    </button>
                                    <button 
                                        className="quick-action-btn"
                                        onClick={handleViewVehicles}
                                    >
                                        <i className="fas fa-cars"></i>
                                        <span>Veículos</span>
                                    </button>
                                    <button 
                                        className="quick-action-btn"
                                        onClick={() => navigate('/clientes')}
                                    >
                                        <i className="fas fa-users"></i>
                                        <span>Clientes</span>
                                    </button>
                                    <button 
                                        className="quick-action-btn"
                                        onClick={() => navigate('/relatorios')}
                                    >
                                        <i className="fas fa-chart-pie"></i>
                                        <span>Relatórios</span>
                                    </button>
                                </div>
                            </div>

                            {/* Performance Widget */}
                            <div className="performance-widget">
                                <h4 className="widget-title">Performance</h4>
                                <div className="performance-item">
                                    <span className="performance-label">Vendas este mês</span>
                                    <div className="performance-progress">
                                        <div className="progress">
                                            <div 
                                                className="progress-bar bg-success" 
                                                style={{ width: '75%' }}
                                            ></div>
                                        </div>
                                        <span className="performance-percent">75%</span>
                                    </div>
                                </div>
                                <div className="performance-item">
                                    <span className="performance-label">Meta comissão</span>
                                    <div className="performance-progress">
                                        <div className="progress">
                                            <div 
                                                className="progress-bar bg-warning" 
                                                style={{ width: '60%' }}
                                            ></div>
                                        </div>
                                        <span className="performance-percent">60%</span>
                                    </div>
                                </div>
                                <div className="performance-item">
                                    <span className="performance-label">Satisfação cliente</span>
                                    <div className="performance-progress">
                                        <div className="progress">
                                            <div 
                                                className="progress-bar bg-primary" 
                                                style={{ width: '90%' }}
                                            ></div>
                                        </div>
                                        <span className="performance-percent">90%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FuncionarioDashboard;
