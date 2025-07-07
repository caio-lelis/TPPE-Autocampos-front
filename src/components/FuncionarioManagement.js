import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function FuncionarioManagement() {
    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    useEffect(() => {
        fetchFuncionarios();
    }, []);

    const fetchFuncionarios = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/v1/funcionarios/get`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setFuncionarios(data);
        } catch (e) {
            setError("Falha ao carregar funcionários: " + e.message);
            console.error("Erro ao buscar funcionários:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (funcionarioId, usuarioId) => {
        if (window.confirm(`Tem certeza que deseja excluir o funcionário com ID de Usuário: ${usuarioId}?`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/funcionarios/delete/${funcionarioId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setFuncionarios(funcionarios.filter(func => func.id !== funcionarioId));
                alert(`Funcionário com ID de Usuário: ${usuarioId} excluído com sucesso!`);
            } catch (e) {
                setError("Falha ao excluir funcionário: " + e.message);
                console.error("Erro ao excluir funcionário:", e);
                alert("Erro ao excluir funcionário. Verifique o console para mais detalhes.");
            }
        }
    };

    if (loading) return <div style={styles.container}>Carregando funcionários...</div>;
    if (error) return <div style={styles.container}><p style={styles.errorText}>{error}</p></div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Gerenciamento de Funcionários</h1>
            <div style={styles.headerActions}>
                <Link to="/funcionarios/create" style={styles.addButton}>+ Adicionar Novo Funcionário</Link>
            </div>
            {funcionarios.length === 0 ? (
                <p>Nenhum funcionário cadastrado.</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>ID Usuário</th>
                            <th style={styles.th}>Rendimento Mensal</th>
                            <th style={styles.th}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {funcionarios.map((func) => (
                            <tr key={func.id} style={styles.tr}>
                                <td style={styles.td}>{func.id}</td>
                                <td style={styles.td}>{func.usuario_id}</td>
                                <td style={styles.td}>R$ {parseFloat(func.rendimento_mensal).toFixed(2)}</td>
                                <td style={styles.td}>
                                    <button onClick={() => navigate(`/funcionarios/view/${func.id}`)} style={styles.actionButton}>Ver Detalhes</button>
                                    <button onClick={() => navigate(`/funcionarios/edit/${func.id}`)} style={{ ...styles.actionButton, ...styles.editButton }}>Editar</button>
                                    <button onClick={() => navigate(`/funcionarios/dashboard/${func.id}`)} style={{ ...styles.actionButton, ...styles.dashboardButton }}>Dashboard</button>
                                    <button onClick={() => handleDelete(func.id, func.usuario_id)} style={{ ...styles.actionButton, ...styles.deleteButton }}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '1000px',
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
    headerActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '20px',
    },
    addButton: {
        backgroundColor: '#28a745',
        color: 'white',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        textDecoration: 'none',
        fontSize: '1em',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
    },
    th: {
        backgroundColor: '#e9ecef',
        padding: '12px',
        textAlign: 'left',
        borderBottom: '1px solid #ddd',
    },
    td: {
        padding: '12px',
        borderBottom: '1px solid #eee',
    },
    tr: {
        backgroundColor: 'white',
    },
    actionButton: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '8px 12px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '5px',
        fontSize: '0.9em',
    },
    editButton: {
        backgroundColor: '#ffc107',
    },
    dashboardButton: {
        backgroundColor: '#6f42c1',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontWeight: 'bold',
    }
};

export default FuncionarioManagement;
