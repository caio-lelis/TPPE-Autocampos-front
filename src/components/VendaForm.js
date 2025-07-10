import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function VendaForm() {
    const { id, mode } = useParams(); // mode pode ser 'create', 'view', 'edit'
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        carro_id: '',
        moto_id: '',
        cliente_id: '',
        funcionario_id: '',
        data_venda: '', // Formato YYYY-MM-DD
        valor_final: '',
        comissao_venda: '',
        observacoes: '',
    });
    const [carros, setCarros] = useState([]);
    const [motos, setMotos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isCreateMode = mode === 'create';

    useEffect(() => {
        const fetchDataForForm = async () => {
            setLoading(true);
            try {
                // Fetch all necessary data for dropdowns
                const [carrosRes, motosRes, clientesRes, funcionariosRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/v1/carros/get`),
                    fetch(`${API_BASE_URL}/api/v1/motos/get`),
                    fetch(`${API_BASE_URL}/api/v1/clientes/get`),
                    fetch(`${API_BASE_URL}/api/v1/funcionarios/get`),
                ]);

                const [carrosData, motosData, clientesData, funcionariosData] = await Promise.all([
                    carrosRes.json(),
                    motosRes.json(),
                    clientesRes.json(),
                    funcionariosRes.json(),
                ]);

                setCarros(carrosData);
                setMotos(motosData);
                setClientes(clientesData);
                setFuncionarios(funcionariosData);

                // If in view or edit mode, fetch specific venda data
                if (isViewMode || isEditMode) {
                    const vendaRes = await fetch(`${API_BASE_URL}/api/v1/vendas/get/${id}`);
                    if (!vendaRes.ok) {
                        throw new Error(`HTTP error! status: ${vendaRes.status}`);
                    }
                    const vendaData = await vendaRes.json();
                    // Formata data para input type="date"
                    vendaData.data_venda = vendaData.data_venda.split('T')[0];
                    setFormData(vendaData);
                }
            } catch (e) {
                setError("Falha ao carregar dados para o formulário: " + e.message);
                console.error("Erro ao buscar dados para o formulário:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchDataForForm();
    }, [id, mode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newFormData = { ...formData, [name]: value };

        // Se um carro for selecionado, limpa o campo da moto
        if (name === 'carro_id' && value) {
            newFormData.moto_id = '';
        }
        // Se uma moto for selecionada, limpa o campo do carro
        if (name === 'moto_id' && value) {
            newFormData.carro_id = '';
        }

        setFormData(newFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Validação: Carro OU Moto, mas não ambos
        if ((formData.carro_id && formData.moto_id) || (!formData.carro_id && !formData.moto_id)) {
            setError("Selecione um Carro OU uma Moto, mas não ambos.");
            setIsSubmitting(false);
            return;
        }

        try {
            let response;
            // Monta o payload sem o campo não selecionado
            let payload = {
                ...formData,
                cliente_id: parseInt(formData.cliente_id),
                funcionario_id: parseInt(formData.funcionario_id),
                valor_final: parseFloat(formData.valor_final),
                comissao_venda: formData.comissao_venda !== '' ? parseFloat(formData.comissao_venda) : null,
            };
            // Remove campo forma_pagamento do payload (caso ainda exista)
            if ('forma_pagamento' in payload) delete payload.forma_pagamento;
            if (formData.carro_id) {
                payload.carro_id = parseInt(formData.carro_id);
                delete payload.moto_id;
            } else if (formData.moto_id) {
                payload.moto_id = parseInt(formData.moto_id);
                delete payload.carro_id;
            }

            if (isCreateMode) {
                response = await fetch(`${API_BASE_URL}/api/v1/vendas/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } else if (isEditMode) {
                response = await fetch(`${API_BASE_URL}/api/v1/vendas/update/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            alert(`Venda ${isCreateMode ? 'registrada' : 'atualizada'} com sucesso!`);
            navigate('/vendas'); // Volta para a lista de vendas
        } catch (e) {
            setError(`Falha ao ${isCreateMode ? 'registrar' : 'atualizar'} venda: ${e.message}`);
            console.error("Erro no envio do formulário:", e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTitle = () => {
        if (isCreateMode) return 'Registrar Nova Venda';
        if (isViewMode) return 'Detalhes da Venda';
        if (isEditMode) return 'Editar Venda';
        return 'Venda';
    };

    if (loading) return <div style={styles.container}>Carregando dados para o formulário...</div>;
    if (error && !isSubmitting) return <div style={styles.container}><p style={styles.errorText}>{error}</p></div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{getTitle()}</h1>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label htmlFor="carro_id" style={styles.label}>Carro:</label>
                    <select
                        id="carro_id"
                        name="carro_id"
                        value={formData.carro_id || ''}
                        onChange={handleChange}
                        disabled={isViewMode || (formData.moto_id && !isCreateMode)} // Desabilita se moto_id estiver preenchido
                        style={styles.input}
                    >
                        <option value="">Selecione um Carro (Opcional)</option>
                        {carros.map(carro => (
                            <option key={carro.id} value={carro.id}>
                                {carro.modelo} ({carro.marca} - {carro.ano})
                            </option>
                        ))}
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="moto_id" style={styles.label}>Moto:</label>
                    <select
                        id="moto_id"
                        name="moto_id"
                        value={formData.moto_id || ''}
                        onChange={handleChange}
                        disabled={isViewMode || (formData.carro_id && !isCreateMode)} // Desabilita se carro_id estiver preenchido
                        style={styles.input}
                    >
                        <option value="">Selecione uma Moto (Opcional)</option>
                        {motos.map(moto => (
                            <option key={moto.id} value={moto.id}>
                                {moto.modelo} ({moto.marca} - {moto.ano})
                            </option>
                        ))}
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="cliente_id" style={styles.label}>Cliente:</label>
                    <select
                        id="cliente_id"
                        name="cliente_id"
                        value={formData.cliente_id}
                        onChange={handleChange}
                        disabled={isViewMode}
                        required
                        style={styles.input}
                    >
                        <option value="">Selecione um Cliente</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nome} (CPF: {cliente.cpf})
                            </option>
                        ))}
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="funcionario_id" style={styles.label}>Funcionário:</label>
                    <select
                        id="funcionario_id"
                        name="funcionario_id"
                        value={formData.funcionario_id}
                        onChange={handleChange}
                        disabled={isViewMode}
                        required
                        style={styles.input}
                    >
                        <option value="">Selecione um Funcionário</option>
                        {funcionarios.map(func => (
                            <option key={func.id} value={func.id}>
                                ID: {func.id} (Usuário ID: {func.usuario_id})
                            </option>
                        ))}
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="data_venda" style={styles.label}>Data da Venda:</label>
                    <input
                        type="date"
                        id="data_venda"
                        name="data_venda"
                        value={formData.data_venda}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="valor_final" style={styles.label}>Valor Total:</label>
                    <input
                        type="number"
                        id="valor_final"
                        name="valor_final"
                        value={formData.valor_final}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        required
                        step="0.01"
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="comissao_venda" style={styles.label}>Comissão da Venda:</label>
                    <input
                        type="number"
                        id="comissao_venda"
                        name="comissao_venda"
                        value={formData.comissao_venda}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        step="0.01"
                        min="0"
                        style={styles.input}
                    />
                </div>
                {/* Campo de forma de pagamento removido */}
                <div style={styles.formGroup}>
                    <label htmlFor="observacoes" style={styles.label}>Observações:</label>
                    <textarea
                        id="observacoes"
                        name="observacoes"
                        value={formData.observacoes}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        rows="3"
                        style={styles.input}
                    ></textarea>
                </div>

                {error && <p style={styles.errorText}>{error}</p>}

                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 32 }}>
                    {isViewMode ? (
                        <>
                            <button type="button" onClick={() => navigate(`/vendas/edit/${id}`)} style={{ ...styles.actionButton, backgroundColor: '#ffc107', color: '#222', minWidth: 120 }}>Editar</button>
                            <button type="button" onClick={() => navigate('/vendas')} style={{ ...styles.actionButton, ...styles.cancelButton, minWidth: 120 }}>Voltar</button>
                        </>
                    ) : (
                        <>
                            <button type="submit" disabled={isSubmitting} style={{ ...styles.actionButton, minWidth: 120 }}>
                                {isSubmitting ? 'Salvando...' : (isCreateMode ? 'Registrar Venda' : 'Salvar Alterações')}
                            </button>
                            <button type="button" onClick={() => navigate(isEditMode ? `/vendas/view/${id}` : '/vendas')} style={{ ...styles.actionButton, ...styles.cancelButton, minWidth: 120 }}>Cancelar</button>
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

export default VendaForm;