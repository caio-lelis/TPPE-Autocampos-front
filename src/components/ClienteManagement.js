import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ClienteManagement() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/v1/clientes/get`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setClientes(data);
        } catch (e) {
            setError("Falha ao carregar clientes: " + e.message);
            console.error("Erro ao buscar clientes:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (clienteId, clienteNome) => {
        if (window.confirm(`Tem certeza que deseja excluir o cliente ${clienteNome}?`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/clientes/delete/${clienteId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setClientes(clientes.filter(cliente => cliente.id !== clienteId));
                alert(`Cliente ${clienteNome} excluído com sucesso!`);
            } catch (e) {
                setError("Falha ao excluir cliente: " + e.message);
                console.error("Erro ao excluir cliente:", e);
                alert("Erro ao excluir cliente. Verifique o console para mais detalhes.");
            }
        }
    };

    if (loading) return <div style={styles.container}>Carregando clientes...</div>;
    if (error) return <div style={styles.container}><p style={styles.errorText}>{error}</p></div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Gerenciamento de Clientes</h1>
            <div style={styles.headerActions}>
                <Link to="/clientes/create" style={styles.addButton}>+ Adicionar Novo Cliente</Link>
            </div>
            {clientes.length === 0 ? (
                <p>Nenhum cliente cadastrado.</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Nome</th>
                            <th style={styles.th}>CPF</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Telefone</th>
                            <th style={styles.th}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente) => (
                            <tr key={cliente.id} style={styles.tr}>
                                <td style={styles.td}>{cliente.id}</td>
                                <td style={styles.td}>{cliente.nome}</td>
                                <td style={styles.td}>{cliente.cpf}</td>
                                <td style={styles.td}>{cliente.email || 'N/A'}</td>
                                <td style={styles.td}>{cliente.telefone || 'N/A'}</td>
                                <td style={styles.td}>
                                    <button onClick={() => navigate(`/clientes/view/${cliente.id}`)} style={styles.actionButton}>Ver Detalhes</button>
                                    <button onClick={() => navigate(`/clientes/edit/${cliente.id}`)} style={{ ...styles.actionButton, ...styles.editButton }}>Editar</button>
                                    <button onClick={() => handleDelete(cliente.id, cliente.nome)} style={{ ...styles.actionButton, ...styles.deleteButton }}>Excluir</button>
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

export default ClienteManagement;
