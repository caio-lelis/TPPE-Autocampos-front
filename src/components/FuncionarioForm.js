import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function FuncionarioForm() {
    const { id, mode } = useParams(); // mode pode ser 'create', 'view', 'edit'
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        usuario_id: '',
        rendimento_mensal: '',
    });
    const [users, setUsers] = useState([]); // Para armazenar a lista de usuários
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isCreateMode = mode === 'create';

    useEffect(() => {
        if (isCreateMode) {
            fetchUsers(); // Busca usuários apenas no modo de criação
        } else if (isViewMode || isEditMode) {
            fetchFuncionarioData(id);
        }
    }, [id, mode]);

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
            setError("Falha ao carregar lista de usuários: " + e.message);
            console.error("Erro ao buscar usuários para seleção:", e);
        } finally {
            setLoading(false);
        }
    };

    const fetchFuncionarioData = async (funcionarioId) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/v1/funcionarios/get/${funcionarioId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setFormData(data); // Preenche o formulário com os dados do funcionário
        } catch (e) {
            setError("Falha ao carregar dados do funcionário: " + e.message);
            console.error("Erro ao buscar dados do funcionário:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            let response;
            if (isCreateMode) {
                response = await fetch(`${API_BASE_URL}/api/v1/funcionarios/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        usuario_id: parseInt(formData.usuario_id), // Garante que seja um número
                        rendimento_mensal: parseFloat(formData.rendimento_mensal) // Garante que seja um número
                    }),
                });
            } else if (isEditMode) {
                response = await fetch(`${API_BASE_URL}/api/v1/funcionarios/update/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        usuario_id: parseInt(formData.usuario_id),
                        rendimento_mensal: parseFloat(formData.rendimento_mensal)
                    }),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            alert(`Funcionário ${isCreateMode ? 'criado' : 'atualizado'} com sucesso!`);
            navigate('/funcionarios'); // Volta para a lista de funcionários
        } catch (e) {
            setError(`Falha ao ${isCreateMode ? 'criar' : 'atualizar'} funcionário: ${e.message}`);
            console.error("Erro no envio do formulário:", e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTitle = () => {
        if (isCreateMode) return 'Criar Novo Funcionário';
        if (isViewMode) return 'Detalhes do Funcionário';
        if (isEditMode) return 'Editar Funcionário';
        return 'Funcionário';
    };

    if (loading) return <div style={styles.container}>Carregando dados...</div>;
    if (error && !isSubmitting) return <div style={styles.container}><p style={styles.errorText}>{error}</p></div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{getTitle()}</h1>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label htmlFor="usuario_id" style={styles.label}>Usuário:</label>
                    {isCreateMode ? (
                        <select
                            id="usuario_id"
                            name="usuario_id"
                            value={formData.usuario_id}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        >
                            <option value="">Selecione um Usuário</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.nome} (ID: {user.id})
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            id="usuario_id"
                            name="usuario_id"
                            value={formData.usuario_id}
                            readOnly={true} // Sempre somente leitura em view/edit
                            style={styles.input}
                        />
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="rendimento_mensal" style={styles.label}>Rendimento Mensal:</label>
                    <input
                        type="number"
                        id="rendimento_mensal"
                        name="rendimento_mensal"
                        value={formData.rendimento_mensal}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        required
                        step="0.01" // Permite valores decimais
                        style={styles.input}
                    />
                </div>

                {error && <p style={styles.errorText}>{error}</p>}

                <div style={styles.buttonGroup}>
                    {isViewMode ? (
                        <>
                            <button type="button" onClick={() => navigate(`/funcionarios/edit/${id}`)} style={styles.actionButton}>Editar</button>
                            <button type="button" onClick={() => navigate('/funcionarios')} style={{ ...styles.actionButton, ...styles.cancelButton }}>Voltar</button>
                        </>
                    ) : (
                        <>
                            <button type="submit" disabled={isSubmitting} style={styles.actionButton}>
                                {isSubmitting ? 'Salvando...' : (isCreateMode ? 'Salvar' : 'Salvar Alterações')}
                            </button>
                            <button type="button" onClick={() => navigate(isEditMode ? `/funcionarios/view/${id}` : '/funcionarios')} style={{ ...styles.actionButton, ...styles.cancelButton }}>
                                Cancelar
                            </button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '600px',
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
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxSizing: 'border-box',
        fontSize: '1em',
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
        marginTop: '10px',
    },
    helpText: {
        fontSize: '0.8em',
        color: '#666',
        marginTop: '5px',
    }
};

export default FuncionarioForm;
