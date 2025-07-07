import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function UserForm() {
    const { id, mode } = useParams(); // mode pode ser 'create', 'view', 'edit'
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        email: '',
        senha: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // URL base da sua API de backend (o nome do serviço 'web' na rede Docker)
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isCreateMode = mode === 'create';

    useEffect(() => {
        if (isViewMode || isEditMode) {
            fetchUserData(id);
        }
    }, [id, mode]); // Dependências para re-executar quando ID ou modo mudarem

    const fetchUserData = async (userId) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/v1/usuarios/get/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setFormData(data); // Preenche o formulário com os dados do usuário
        } catch (e) {
            setError("Falha ao carregar dados do usuário: " + e.message);
            console.error("Erro ao buscar dados do usuário:", e);
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
                response = await fetch(`${API_BASE_URL}/api/v1/usuarios/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            } else if (isEditMode) {
                // ATENÇÃO: Seu endpoint PUT espera o schema UsuarioCreate, que inclui 'senha'.
                // Se a senha não for alterada, você precisará enviá-la novamente.
                // Em um cenário real, o ideal seria um schema UsuarioUpdate onde a senha é opcional,
                // ou um endpoint separado para alteração de senha.
                response = await fetch(`${API_BASE_URL}/api/v1/usuarios/update/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            alert(`Usuário ${isCreateMode ? 'criado' : 'atualizado'} com sucesso!`);
            navigate('/usuarios'); // Volta para a lista de usuários
        } catch (e) {
            setError(`Falha ao ${isCreateMode ? 'criar' : 'atualizar'} usuário: ${e.message}`);
            console.error("Erro no envio do formulário:", e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTitle = () => {
        if (isCreateMode) return 'Criar Novo Usuário';
        if (isViewMode) return 'Detalhes do Usuário';
        if (isEditMode) return 'Editar Usuário';
        return 'Usuário';
    };

    if (loading) return <div style={styles.container}>Carregando dados do usuário...</div>;
    if (error && !isSubmitting) return <div style={styles.container}><p style={styles.errorText}>{error}</p></div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{getTitle()}</h1>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label htmlFor="nome" style={styles.label}>Nome:</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="cpf" style={styles.label}>CPF:</label>
                    <input
                        type="text"
                        id="cpf"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        required
                        style={styles.input}
                        placeholder="Ex: 123.456.789-00"
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="email" style={styles.label}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        required
                        style={styles.input}
                    />
                </div>
                {/* Senha só é exibida em modo de criação ou edição */}
                {(!isViewMode) && (
                    <div style={styles.formGroup}>
                        <label htmlFor="senha" style={styles.label}>Senha:</label>
                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            value={formData.senha}
                            onChange={handleChange}
                            required={isCreateMode} // Senha é obrigatória na criação
                            style={styles.input}
                            placeholder={isEditMode ? "Deixe em branco para não alterar" : ""}
                        />
                        {isEditMode && <p style={styles.helpText}>* Se estiver editando, digite a senha novamente para confirmar as alterações, ou deixe em branco se seu backend permitir.</p>}
                    </div>
                )}

                {error && <p style={styles.errorText}>{error}</p>}

                <div style={styles.buttonGroup}>
                    {isViewMode ? (
                        <>
                            <button type="button" onClick={() => navigate(`/usuarios/edit/${id}`)} style={styles.actionButton}>Editar</button>
                            <button type="button" onClick={() => navigate('/usuarios')} style={{ ...styles.actionButton, ...styles.cancelButton }}>Voltar</button>
                        </>
                    ) : (
                        <>
                            <button type="submit" disabled={isSubmitting} style={styles.actionButton}>
                                {isSubmitting ? 'Salvando...' : (isCreateMode ? 'Salvar' : 'Salvar Alterações')}
                            </button>
                            <button type="button" onClick={() => navigate(isEditMode ? `/usuarios/view/${id}` : '/usuarios')} style={{ ...styles.actionButton, ...styles.cancelButton }}>
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

export default UserForm;
