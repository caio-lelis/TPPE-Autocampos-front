import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // URL base da sua API de backend (o nome do serviço 'web' na rede Docker)
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/v1/usuarios/get`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setUsers(data);
        } catch (e) {
            setError("Falha ao carregar usuários: " + e.message);
            console.error("Erro ao buscar usuários:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId, userName) => {
        if (window.confirm(`Tem certeza que deseja excluir o usuário ${userName}?`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/usuarios/delete/${userId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // Remove o usuário da lista localmente após a exclusão bem-sucedida
                setUsers(users.filter(user => user.id !== userId));
                alert(`Usuário ${userName} excluído com sucesso!`);
            } catch (e) {
                setError("Falha ao excluir usuário: " + e.message);
                console.error("Erro ao excluir usuário:", e);
                alert("Erro ao excluir usuário. Verifique o console para mais detalhes.");
            }
        }
    };

    if (loading) return <div style={styles.container}>Carregando usuários...</div>;
    if (error) return <div style={styles.container}><p style={styles.errorText}>{error}</p></div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Gerenciamento de Usuários</h1>
            <div style={styles.headerActions}>
                <Link to="/usuarios/create" style={styles.addButton}>+ Adicionar Novo Usuário</Link>
            </div>
            {users.length === 0 ? (
                <p>Nenhum usuário cadastrado.</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Nome</th>
                            <th style={styles.th}>CPF</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} style={styles.tr}>
                                <td style={styles.td}>{user.id}</td>
                                <td style={styles.td}>{user.nome}</td>
                                <td style={styles.td}>{user.cpf}</td>
                                <td style={styles.td}>{user.email}</td>
                                <td style={styles.td}>
                                    <button onClick={() => navigate(`/usuarios/view/${user.id}`)} style={styles.actionButton}>Ver Detalhes</button>
                                    <button onClick={() => navigate(`/usuarios/edit/${user.id}`)} style={{ ...styles.actionButton, ...styles.editButton }}>Editar</button>
                                    <button onClick={() => handleDelete(user.id, user.nome)} style={{ ...styles.actionButton, ...styles.deleteButton }}>Excluir</button>
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
    deleteButton: {
        backgroundColor: '#dc3545',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontWeight: 'bold',
    }
};

export default UserManagement;
