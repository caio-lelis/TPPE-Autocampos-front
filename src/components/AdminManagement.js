import React, { useState, useEffect } from 'react';

function AdminManagement() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/v1/admins/get`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setAdmins(data);
        } catch (e) {
            setError('Falha ao carregar admins: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (adminId, adminName) => {
        if (window.confirm(`Tem certeza que deseja remover o admin ${adminName}?`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/admins/delete/${adminId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setAdmins(admins.filter(admin => admin.id !== adminId));
                alert(`Admin ${adminName} removido com sucesso!`);
            } catch (e) {
                setError('Falha ao remover admin: ' + e.message);
                alert('Erro ao remover admin. Verifique o console para mais detalhes.');
            }
        }
    };

    // Adicionar admin: espera um id de usuário existente
    const [newUserId, setNewUserId] = useState('');
    const handleAddAdmin = async () => {
        if (!newUserId) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/admins/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: Number(newUserId) })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await fetchAdmins();
            setNewUserId('');
            alert('Usuário promovido a admin com sucesso!');
        } catch (e) {
            setError('Falha ao adicionar admin: ' + e.message);
            alert('Erro ao adicionar admin. Verifique o console para mais detalhes.');
        }
    };

    if (loading) return <div style={styles.container}>Carregando admins...</div>;
    if (error) return <div style={styles.container}><p style={styles.errorText}>{error}</p></div>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Usuários Admins</h2>
            <div style={{ marginBottom: 20 }}>
                <input
                    type="number"
                    placeholder="ID do usuário para promover"
                    value={newUserId}
                    onChange={e => setNewUserId(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleAddAdmin} style={styles.addButton}>Promover a Admin</button>
            </div>
            {admins.length === 0 ? (
                <p>Nenhum admin cadastrado.</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Nome</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin) => (
                            <tr key={admin.id} style={styles.tr}>
                                <td style={styles.td}>{admin.id}</td>
                                <td style={styles.td}>{admin.usuario?.nome || '-'}</td>
                                <td style={styles.td}>{admin.usuario?.email || '-'}</td>
                                <td style={{ ...styles.td, minWidth: 120 }}>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                                        <button onClick={() => handleDelete(admin.id, admin.usuario?.nome)} style={{ ...styles.actionButton, ...styles.deleteButton, marginRight: 0 }}>Remover</button>
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
    input: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginRight: '10px',
        fontSize: '1em',
    },
    addButton: {
        backgroundColor: '#FFD600',
        color: '#222',
        padding: '8px 14px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 600,
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
    deleteButton: {
        backgroundColor: '#dc3545',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontWeight: 'bold',
    }
};

export default AdminManagement;
