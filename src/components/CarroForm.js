import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CarroForm() {
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
        tipo_direcao: '',
        tracao: '',
        consumo_cidade: '',
        airbag: false,
        ar_condicionado: false,
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
            fetchCarroData(id);
        }
    }, [id, mode]);

    const fetchCarroData = async (carroId) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/v1/carros/get/${carroId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setFormData(data); // Preenche o formulário com os dados do carro
        } catch (e) {
            setError("Falha ao carregar dados do carro: " + e.message);
            console.error("Erro ao buscar dados do carro:", e);
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
                consumo_cidade: formData.consumo_cidade ? parseFloat(formData.consumo_cidade) : null,
            };

            if (isCreateMode) {
                response = await fetch(`${API_BASE_URL}/api/v1/carros/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } else if (isEditMode) {
                response = await fetch(`${API_BASE_URL}/api/v1/carros/update/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            alert(`Carro ${isCreateMode ? 'criado' : 'atualizado'} com sucesso!`);
            navigate('/carros'); // Volta para a lista de carros
        } catch (e) {
            setError(`Falha ao ${isCreateMode ? 'criar' : 'atualizar'} carro: ${e.message}`);
            console.error("Erro no envio do formulário:", e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTitle = () => {
        if (isCreateMode) return 'Criar Novo Carro';
        if (isViewMode) return 'Detalhes do Carro';
        if (isEditMode) return 'Editar Carro';
        return 'Carro';
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
                    <select
                        id="tipo_combustivel"
                        name="tipo_combustivel"
                        value={formData.tipo_combustivel}
                        onChange={handleChange}
                        disabled={isViewMode}
                        required
                        style={styles.input}
                    >
                        <option value="">Selecione...</option>
                        <option value="etanol">Etanol</option>
                        <option value="gasolina">Gasolina</option>
                        <option value="flex">Flex</option>
                        <option value="diesel">Diesel</option>
                    </select>
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
                    <label htmlFor="tipo_direcao" style={styles.label}>Tipo de Direção:</label>
                    <select
                        id="tipo_direcao"
                        name="tipo_direcao"
                        value={formData.tipo_direcao}
                        onChange={handleChange}
                        disabled={isViewMode}
                        required
                        style={styles.input}
                    >
                        <option value="">Selecione...</option>
                        <option value="hidráulica">Hidráulica</option>
                        <option value="mecânica">Mecânica</option>
                        <option value="elétrica">Elétrica</option>
                        <option value="eletrohidráulica">Eletrohidráulica</option>
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="tracao" style={styles.label}>Tração:</label>
                    <select
                        id="tracao"
                        name="tracao"
                        value={formData.tracao}
                        onChange={handleChange}
                        disabled={isViewMode}
                        required
                        style={styles.input}
                    >
                        <option value="">Selecione...</option>
                        <option value="dianteira">Dianteira</option>
                        <option value="traseira">Traseira</option>
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="consumo_cidade" style={styles.label}>Consumo Cidade (km/l):</label>
                    <input
                        type="number"
                        id="consumo_cidade"
                        name="consumo_cidade"
                        value={formData.consumo_cidade}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        step="0.01"
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="airbag" style={styles.label}>Airbag:</label>
                    <input
                        type="checkbox"
                        id="airbag"
                        name="airbag"
                        checked={formData.airbag}
                        onChange={handleChange}
                        disabled={isViewMode}
                        style={styles.checkbox}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="ar_condicionado" style={styles.label}>Ar Condicionado:</label>
                    <input
                        type="checkbox"
                        id="ar_condicionado"
                        name="ar_condicionado"
                        checked={formData.ar_condicionado}
                        onChange={handleChange}
                        disabled={isViewMode}
                        style={styles.checkbox}
                    />
                </div>

                {error && <p style={styles.errorText}>{error}</p>}

                <div style={styles.buttonGroup}>
                    {isViewMode ? (
                        <>
                            <button type="button" onClick={() => navigate(`/carros/edit/${id}`)} style={styles.actionButton}>Editar</button>
                            <button type="button" onClick={() => navigate('/carros')} style={{ ...styles.actionButton, ...styles.cancelButton }}>Voltar</button>
                        </>
                    ) : (
                        <>
                            <button type="submit" disabled={isSubmitting} style={styles.actionButton}>
                                {isSubmitting ? 'Salvando...' : (isCreateMode ? 'Salvar' : 'Salvar Alterações')}
                            </button>
                            <button type="button" onClick={() => navigate(isEditMode ? `/carros/view/${id}` : '/carros')} style={{ ...styles.actionButton, ...styles.cancelButton }}>
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

export default CarroForm;
