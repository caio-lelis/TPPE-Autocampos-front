import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function VendaManagement() {
    const [vendas, setVendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    useEffect(() => {
        fetchVendas();
    }, []);

    const fetchVendas = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/v1/vendas/get`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setVendas(data);
        } catch (e) {
            setError("Falha ao carregar vendas: " + e.message);
            console.error("Erro ao buscar vendas:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (vendaId) => {
        if (window.confirm(`Tem certeza que deseja excluir a venda ${vendaId}?`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/vendas/delete/${vendaId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setVendas(vendas.filter(venda => venda.id !== vendaId));
                alert(`Venda ${vendaId} excluída com sucesso!`);
            } catch (e) {
                setError("Falha ao excluir venda: " + e.message);
                console.error("Erro ao excluir venda:", e);
                alert("Erro ao excluir venda. Verifique o console para mais detalhes.");
            }
        }
    };

    if (loading) return <div style={styles.container}>Carregando vendas...</div>;
    if (error) return <div style={styles.container}><p style={styles.errorText}>{error}</p></div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Gerenciamento de Vendas</h1>
            <div style={styles.headerActions}>
                <Link to="/vendas/create" style={styles.addButton}>+ Registrar Nova Venda</Link>
            </div>
            {vendas.length === 0 ? (
                <p>Nenhuma venda registrada.</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Carro</th>
                            <th style={styles.th}>Moto</th>
                            <th style={styles.th}>Cliente</th>
                            <th style={styles.th}>Funcionário</th>
                            <th style={styles.th}>Data da Venda</th>
                            <th style={styles.th}>Valor Total</th>
                            <th style={styles.th}>Comissão</th>
                            <th style={styles.th}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendas.map((venda) => (
                            <tr key={venda.id} style={styles.tr}>
                                <td style={styles.td}>{venda.id}</td>
                                <td style={styles.td}>{venda.carro ? `${venda.carro.modelo} (${venda.carro.marca} - ${venda.carro.ano})` : 'N/A'}</td>
                                <td style={styles.td}>{venda.moto ? `${venda.moto.modelo} (${venda.moto.marca} - ${venda.moto.ano})` : 'N/A'}</td>
                                <td style={styles.td}>{venda.cliente ? venda.cliente.nome : venda.cliente_id}</td>
                                <td style={styles.td}>{venda.funcionario && venda.funcionario.usuario ? venda.funcionario.usuario.nome : venda.funcionario_id}</td>
                                <td style={styles.td}>{new Date(venda.data_venda).toLocaleDateString()}</td>
                                <td style={styles.td}>R$ {parseFloat(venda.valor_final).toFixed(2)}</td>
                                <td style={styles.td}>{venda.comissao_venda !== undefined && venda.comissao_venda !== null ? `R$ ${parseFloat(venda.comissao_venda).toFixed(2)}` : '-'}</td>
                                <td style={styles.td}>
                                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                        <button onClick={() => navigate(`/vendas/view/${venda.id}`)} style={styles.actionButton}>Ver Detalhes</button>
                                        <button onClick={() => navigate(`/vendas/edit/${venda.id}`)} style={{ ...styles.actionButton, ...styles.editButton }}>Editar</button>
                                        <button onClick={() => handleDelete(venda.id)} style={{ ...styles.actionButton, ...styles.deleteButton }}>Excluir</button>
                                    </div>
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

export default VendaManagement;