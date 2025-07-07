import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function CarroManagement() {
    const [carros, setCarros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    useEffect(() => {
        fetchCarros();
    }, []);

    const fetchCarros = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/v1/carros/get`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCarros(data);
        } catch (e) {
            setError("Falha ao carregar carros: " + e.message);
            console.error("Erro ao buscar carros:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (carroId, carroModelo) => {
        if (window.confirm(`Tem certeza que deseja excluir o carro ${carroModelo}?`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/carros/delete/${carroId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setCarros(carros.filter(carro => carro.id !== carroId));
                alert(`Carro ${carroModelo} excluído com sucesso!`);
            } catch (e) {
                setError("Falha ao excluir carro: " + e.message);
                console.error("Erro ao excluir carro:", e);
                alert("Erro ao excluir carro. Verifique o console para mais detalhes.");
            }
        }
    };

    if (loading) return <div style={styles.container}>Carregando carros...</div>;
    if (error) return <div style={styles.container}><p style={styles.errorText}>{error}</p></div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Gerenciamento de Carros</h1>
            <div style={styles.headerActions}>
                <Link to="/carros/create" style={styles.addButton}>+ Adicionar Novo Carro</Link>
            </div>
            {carros.length === 0 ? (
                <p>Nenhum carro cadastrado.</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Modelo</th>
                            <th style={styles.th}>Marca</th>
                            <th style={styles.th}>Ano</th>
                            <th style={styles.th}>Preço</th>
                            <th style={styles.th}>Disponível</th>
                            <th style={styles.th}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carros.map((carro) => (
                            <tr key={carro.id} style={styles.tr}>
                                <td style={styles.td}>{carro.id}</td>
                                <td style={styles.td}>{carro.modelo}</td>
                                <td style={styles.td}>{carro.marca}</td>
                                <td style={styles.td}>{carro.ano}</td>
                                <td style={styles.td}>R$ {parseFloat(carro.preco).toFixed(2)}</td>
                                <td style={styles.td}>{carro.disponivel ? 'Sim' : 'Não'}</td>
                                <td style={styles.td}>
                                    <button onClick={() => navigate(`/carros/view/${carro.id}`)} style={styles.actionButton}>Ver Detalhes</button>
                                    <button onClick={() => navigate(`/carros/edit/${carro.id}`)} style={{ ...styles.actionButton, ...styles.editButton }}>Editar</button>
                                    <button onClick={() => handleDelete(carro.id, carro.modelo)} style={{ ...styles.actionButton, ...styles.deleteButton }}>Excluir</button>
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
        maxWidth: '1200px',
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
    deleteButton: {
        backgroundColor: '#dc3545',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontWeight: 'bold',
    }
};

export default CarroManagement;
