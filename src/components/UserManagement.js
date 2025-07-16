import React, { useState, useEffect } from 'react';
import { FiLogOut } from 'react-icons/fi'; // ícone de logout moderno
import { Link, useNavigate } from 'react-router-dom';
import AdminManagement from './AdminManagement';


function UserManagement() {
    const [activeTab, setActiveTab] = useState('usuarios');

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Gerenciamento de Usuários</h1>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                <button
                    style={{
                        ...styles.tabButton,
                        background: activeTab === 'usuarios' ? '#FFD600' : '#eee',
                        color: activeTab === 'usuarios' ? '#111' : '#555',
                        borderBottom: activeTab === 'usuarios' ? '3px solid #FFD600' : '3px solid transparent',
                    }}
                    onClick={() => setActiveTab('usuarios')}
                >Usuários</button>
                <button
                    style={{
                        ...styles.tabButton,
                        background: activeTab === 'admins' ? '#FFD600' : '#eee',
                        color: activeTab === 'admins' ? '#111' : '#555',
                        borderBottom: activeTab === 'admins' ? '3px solid #FFD600' : '3px solid transparent',
                    }}
                    onClick={() => setActiveTab('admins')}
                >Usuários Admins</button>
            </div>
            {activeTab === 'usuarios' ? <UsuariosTab /> : <AdminManagement />}
        </div>
    );
}

// Conteúdo da aba de usuários (código original)
function UsuariosTab() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
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
            setUsers(data.map(u => ({ ...u, isAdmin: u.isAdmin ?? false })));
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
                setUsers(users.filter(user => user.id !== userId));
                alert(`Usuário ${userName} excluído com sucesso!`);
            } catch (e) {
                setError("Falha ao excluir usuário: " + e.message);
                console.error("Erro ao excluir usuário:", e);
                alert("Erro ao excluir usuário. Verifique o console para mais detalhes.");
            }
        }
    };

    const handleToggleAdmin = async (userId) => {
        const user = users.find(u => u.id === userId);
        try {
            // Busca lista de admins existentes
            const adminsResp = await fetch(`${API_BASE_URL}/api/v1/admins/get`);
            const admins = await adminsResp.json();
            const adm = admins.find(a => a.usuario_id === userId);
            let response;
            if (!user.isAdmin) {
                // Promove a admin: atualiza se já existe, senão cria
                if (adm) {
                    response = await fetch(`${API_BASE_URL}/api/v1/admins/update/${adm.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ usuario_id: userId, is_admin: true })
                    });
                } else {
                    response = await fetch(`${API_BASE_URL}/api/v1/admins/create`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ usuario_id: userId, is_admin: true })
                    });
                }
            } else {
                // Revoga admin: atualiza flag is_admin para false
                if (adm) {
                    response = await fetch(`${API_BASE_URL}/api/v1/admins/update/${adm.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ usuario_id: userId, is_admin: false })
                    });
                }
            }
            if (response && !response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, isAdmin: !u.isAdmin } : u));
        } catch (e) {
            setError('Falha ao atualizar status de administrador: ' + e.message);
            console.error('Erro ao alternar admin:', e);
        }
    };

    if (loading) return <div style={styles.container}>Carregando usuários...</div>;
    if (error) return <div style={styles.container}><p style={styles.errorText}>{error}</p></div>;

    return (
        <>
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
                            <th style={styles.th}>Admin?</th>
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
                                <td style={{ ...styles.td, textAlign: 'center' }}>
                                    <label style={{ display: 'inline-block', cursor: 'pointer', margin: 0, position: 'relative', minWidth: 44 }}>
                                        <input
                                            type='checkbox'
                                            checked={user.isAdmin}
                                            onChange={() => handleToggleAdmin(user.id)}
                                            style={{
                                                opacity: 0,
                                                width: 40,
                                                height: 24,
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                margin: 0,
                                                zIndex: 2,
                                                cursor: 'pointer',
                                            }}
                                            aria-label={`Tornar ${user.nome} admin`}
                                        />
                                        <span style={{
                                            display: 'inline-block',
                                            width: 40,
                                            height: 24,
                                            background: user.isAdmin ? '#FFD600' : '#ccc',
                                            borderRadius: 12,
                                            position: 'relative',
                                            transition: 'background 0.2s',
                                            boxShadow: user.isAdmin ? '0 2px 6px #ffe06680' : '0 1px 2px #0001',
                                        }}>
                                            <span style={{
                                                position: 'absolute',
                                                left: user.isAdmin ? 20 : 2,
                                                top: 2,
                                                width: 20,
                                                height: 20,
                                                background: user.isAdmin ? '#111' : '#fff',
                                                borderRadius: '50%',
                                                transition: 'left 0.2s, background 0.2s',
                                                boxShadow: '0 1px 4px #0002',
                                                border: user.isAdmin ? '2px solid #FFD600' : '1.5px solid #bbb',
                                            }} />
                                        </span>
                                    </label>
                                </td>
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
        </>
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
    tabButton: {
        padding: '10px 24px',
        border: 'none',
        borderRadius: '8px 8px 0 0',
        fontWeight: 600,
        fontSize: '1em',
        cursor: 'pointer',
        outline: 'none',
        marginRight: 2,
        marginBottom: -2,
        boxShadow: '0 1px 2px #0001',
        transition: 'background 0.2s, color 0.2s, border-bottom 0.2s',
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
