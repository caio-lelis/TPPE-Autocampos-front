import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function MotoForm() {
    const { id, mode } = useParams(); // mode pode ser 'create', 'view', 'edit'
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        modelo: '',
        marca: '',
        ano: '',
        cor: '',
        tipo_combustivel: '',
        preco: '',
        revisado: false,
        disponivel: true,
        freio_dianteiro: '',
        freio_traseiro: '',
        estilo: '',
        cilindradas: '',
        velocidade_max: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isCreateMode = mode === 'create';

    useEffect(() => {
        if (isViewMode || isEditMode) {
            fetchMotoData(id);
        }
    }, [id, mode]);

    const fetchMotoData = async (motoId) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/v1/motos/get/${motoId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setFormData(data); // Preenche o formulário com os dados da moto
        } catch (e) {
            setError("Falha ao carregar dados da moto: " + e.message);
            console.error("Erro ao buscar dados da moto:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            let response;
            const payload = {
                ...formData,
                ano: parseInt(formData.ano),
                preco: parseFloat(formData.preco),
                cilindradas: formData.cilindradas ? parseInt(formData.cilindradas) : null,
                velocidade_max: formData.velocidade_max ? parseInt(formData.velocidade_max) : null,
            };

            if (isCreateMode) {
                response = await fetch(`${API_BASE_URL}/api/v1/motos/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } else if (isEditMode) {
                response = await fetch(`${API_BASE_URL}/api/v1/motos/update/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            alert(`Moto ${isCreateMode ? 'criada' : 'atualizada'} com sucesso!`);
            navigate('/motos'); // Volta para a lista de motos
        } catch (e) {
            setError(`Falha ao ${isCreateMode ? 'criar' : 'atualizar'} moto: ${e.message}`);
            console.error("Erro no envio do formulário:", e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTitle = () => {
        if (isCreateMode) return 'Criar Nova Moto';
        if (isViewMode) return 'Detalhes da Moto';
        if (isEditMode) return 'Editar Moto';
        return 'Moto';
    };

    if (loading) return <div style={styles.container}>Carregando dados...</div>;
    if (error && !isSubmitting) return <div style={styles.container}><p style={styles.errorText}>{error}</p></div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{getTitle()}</h1>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label htmlFor="modelo" style={styles.label}>Modelo:</label>
                    <input
                        type="text"
                        id="modelo"
                        name="modelo"
                        value={formData.modelo}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="marca" style={styles.label}>Marca:</label>
                    <input
                        type="text"
                        id="marca"
                        name="marca"
                        value={formData.marca}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="ano" style={styles.label}>Ano:</label>
                    <input
                        type="number"
                        id="ano"
                        name="ano"
                        value={formData.ano}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        required
                        min="1900"
                        max="2100"
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="cor" style={styles.label}>Cor:</label>
                    <input
                        type="text"
                        id="cor"
                        name="cor"
                        value={formData.cor}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="tipo_combustivel" style={styles.label}>Tipo de Combustível:</label>
                    <input
                        type="text"
                        id="tipo_combustivel"
                        name="tipo_combustivel"
                        value={formData.tipo_combustivel}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="preco" style={styles.label}>Preço:</label>
                    <input
                        type="number"
                        id="preco"
                        name="preco"
                        value={formData.preco}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        required
                        step="0.01"
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="revisado" style={styles.label}>Revisado:</label>
                    <input
                        type="checkbox"
                        id="revisado"
                        name="revisado"
                        checked={formData.revisado}
                        onChange={handleChange}
                        disabled={isViewMode}
                        style={styles.checkbox}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="disponivel" style={styles.label}>Disponível:</label>
                    <input
                        type="checkbox"
                        id="disponivel"
                        name="disponivel"
                        checked={formData.disponivel}
                        onChange={handleChange}
                        disabled={isViewMode}
                        style={styles.checkbox}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="freio_dianteiro" style={styles.label}>Freio Dianteiro:</label>
                    <input
                        type="text"
                        id="freio_dianteiro"
                        name="freio_dianteiro"
                        value={formData.freio_dianteiro}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="freio_traseiro" style={styles.label}>Freio Traseiro:</label>
                    <input
                        type="text"
                        id="freio_traseiro"
                        name="freio_traseiro"
                        value={formData.freio_traseiro}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="estilo" style={styles.label}>Estilo:</label>
                    <input
                        type="text"
                        id="estilo"
                        name="estilo"
                        value={formData.estilo}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="cilindradas" style={styles.label}>Cilindradas:</label>
                    <input
                        type="number"
                        id="cilindradas"
                        name="cilindradas"
                        value={formData.cilindradas}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        min="0"
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="velocidade_max" style={styles.label}>Velocidade Máxima (km/h):</label>
                    <input
                        type="number"
                        id="velocidade_max"
                        name="velocidade_max"
                        value={formData.velocidade_max}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        min="0"
                        style={styles.input}
                    />
                </div>

                {error && <p style={styles.errorText}>{error}</p>}

                <div style={styles.buttonGroup}>
                    {isViewMode ? (
                        <>
                            <button type="button" onClick={() => navigate(`/motos/edit/${id}`)} style={styles.actionButton}>Editar</button>
                            <button type="button" onClick={() => navigate('/motos')} style={{ ...styles.actionButton, ...styles.cancelButton }}>Voltar</button>
                        </>
                    ) : (
                        <>
                            <button type="submit" disabled={isSubmitting} style={styles.actionButton}>
                                {isSubmitting ? 'Salvando...' : (isCreateMode ? 'Salvar' : 'Salvar Alterações')}
                            </button>
                            <button type="button" onClick={() => navigate(isEditMode ? `/motos/view/${id}` : '/motos')} style={{ ...styles.actionButton, ...styles.cancelButton }}>
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
    checkbox: {
        marginRight: '10px',
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

export default MotoForm;
