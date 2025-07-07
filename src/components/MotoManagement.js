import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function MotoManagement() {
    const [motos, setMotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    useEffect(() => {
        fetchMotos();
    }, []);

    const fetchMotos = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/v1/motos/get`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setMotos(data);
        } catch (e) {
            setError("Falha ao carregar motos: " + e.message);
            console.error("Erro ao buscar motos:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (motoId, motoModelo) => {
        if (window.confirm(`Tem certeza que deseja excluir a moto ${motoModelo}?`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/motos/delete/${motoId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setMotos(motos.filter(moto => moto.id !== motoId));
                alert(`Moto ${motoModelo} excluída com sucesso!`);
            } catch (e) {
                setError("Falha ao excluir moto: " + e.message);
                console.error("Erro ao excluir moto:", e);
                alert("Erro ao excluir moto. Verifique o console para mais detalhes.");
            }
        }
    };

    if (loading) return <div style={styles.container}>Carregando motos...</div>;
    if (error) return <div style={styles.container}><p style={styles.errorText}>{error}</p></div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Gerenciamento de Motos</h1>
            <div style={styles.headerActions}>
                <Link to="/motos/create" style={styles.addButton}>+ Adicionar Nova Moto</Link>
            </div>
            {motos.length === 0 ? (
                <p>Nenhuma moto cadastrada.</p>
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
                        {motos.map((moto) => (
                            <tr key={moto.id} style={styles.tr}>
                                <td style={styles.td}>{moto.id}</td>
                                <td style={styles.td}>{moto.modelo}</td>
                                <td style={styles.td}>{moto.marca}</td>
                                <td style={styles.td}>{moto.ano}</td>
                                <td style={styles.td}>R$ {parseFloat(moto.preco).toFixed(2)}</td>
                                <td style={styles.td}>{moto.disponivel ? 'Sim' : 'Não'}</td>
                                <td style={styles.td}>
                                    <button onClick={() => navigate(`/motos/view/${moto.id}`)} style={styles.actionButton}>Ver Detalhes</button>
                                    <button onClick={() => navigate(`/motos/edit/${moto.id}`)} style={{ ...styles.actionButton, ...styles.editButton }}>Editar</button>
                                    <button onClick={() => handleDelete(moto.id, moto.modelo)} style={{ ...styles.actionButton, ...styles.deleteButton }}>Excluir</button>
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

export default MotoManagement;
