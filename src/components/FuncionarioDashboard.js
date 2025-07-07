import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function FuncionarioDashboard() {
    const { id } = useParams(); // ID do funcionário
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div style={styles.container}>Carregando dashboard...</div>;
    if (error) return <div style={styles.container}><p style={styles.errorText}>{error}</p></div>;
    if (!dashboardData) return <div style={styles.container}><p>Nenhum dado de dashboard disponível.</p></div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Dashboard do Funcionário (ID: {dashboardData.funcionario_id})</h1>
            <div style={styles.metricas}>
                <div style={styles.metricaItem}>
                    <h3>Total de Carros Vendidos:</h3>
                    <p style={styles.metricaValue}>{dashboardData.metricas.total_carros_vendidos}</p>
                </div>
                <div style={styles.metricaItem}>
                    <h3>Total de Comissões:</h3>
                    <p style={styles.metricaValue}>R$ {parseFloat(dashboardData.metricas.total_comissoes).toFixed(2)}</p>
                </div>
            </div>
            {dashboardData.grafico && (
                <div style={styles.graficoContainer}>
                    <h2>Gráfico de Vendas</h2>
                    <img src={dashboardData.grafico} alt="Gráfico de Vendas" style={styles.graficoImg} />
                </div>
            )}
            <div style={styles.buttonGroup}>
                <button type="button" onClick={() => navigate('/funcionarios')} style={{ ...styles.actionButton, ...styles.cancelButton }}>Voltar para Lista</button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '800px',
        margin: '20px auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
    },
    metricas: {
        display: 'flex',
        justifyContent: 'space-around',
        marginBottom: '30px',
        flexWrap: 'wrap',
    },
    metricaItem: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textAlign: 'center',
        minWidth: '200px',
        margin: '10px',
    },
    metricaValue: {
        fontSize: '2em',
        fontWeight: 'bold',
        color: '#007bff',
    },
    graficoContainer: {
        textAlign: 'center',
        marginTop: '30px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    graficoImg: {
        maxWidth: '100%',
        height: 'auto',
        marginTop: '15px',
        border: '1px solid #eee',
        borderRadius: '4px',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '20px',
    },
    actionButton: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
        marginRight: '10px',
    },
    cancelButton: {
        backgroundColor: '#6c757d',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontWeight: 'bold',
    }
};

export default FuncionarioDashboard;
