import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AnuncioForm() {
    const [formData, setFormData] = useState({
        funcionario_id: '',
        carro_id: '',
        moto_id: '',
        data_publicacao: '',
        imagem1: null,
        imagem2: null,
        imagem3: null
    });
    const [previews, setPreviews] = useState({
        imagem1: null,
        imagem2: null,
        imagem3: null
    });
    const [funcionarios, setFuncionarios] = useState([]);
    const [carros, setCarros] = useState([]);
    const [motos, setMotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [funcResponse, carrosResponse, motosResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/api/v1/funcionarios/get`),
                fetch(`${API_BASE_URL}/api/v1/carros/get`),
                fetch(`${API_BASE_URL}/api/v1/motos/get`)
            ]);

            if (funcResponse.ok) {
                const funcData = await funcResponse.json();
                setFuncionarios(funcData);
            }

            if (carrosResponse.ok) {
                const carrosData = await carrosResponse.json();
                setCarros(carrosData.filter(carro => carro.disponivel));
            }

            if (motosResponse.ok) {
                const motosData = await motosResponse.json();
                setMotos(motosData.filter(moto => moto.disponivel));
            }
        } catch (err) {
            setError('Erro ao carregar dados iniciais');
            console.error('Erro:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpar o outro campo quando um for selecionado
        if (name === 'carro_id' && value) {
            setFormData(prev => ({ ...prev, moto_id: '' }));
        } else if (name === 'moto_id' && value) {
            setFormData(prev => ({ ...prev, carro_id: '' }));
        }
    };

    const handleImageChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        
        if (file) {
            // Validar tipo de arquivo
            if (!file.type.startsWith('image/')) {
                setError('Por favor, selecione apenas arquivos de imagem');
                return;
            }
            
            // Validar tamanho (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('A imagem deve ter no máximo 5MB');
                return;
            }
            
            // Atualizar arquivo no estado
            setFormData(prev => ({
                ...prev,
                [name]: file
            }));
            
            // Criar preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviews(prev => ({
                    ...prev,
                    [name]: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (imageName) => {
        setFormData(prev => ({
            ...prev,
            [imageName]: null
        }));
        setPreviews(prev => ({
            ...prev,
            [imageName]: null
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validações
            if (!formData.funcionario_id) {
                throw new Error('Funcionário é obrigatório');
            }
            
            if (!formData.carro_id && !formData.moto_id) {
                throw new Error('Selecione um carro ou uma moto');
            }
            
            if (formData.carro_id && formData.moto_id) {
                throw new Error('Selecione apenas um carro OU uma moto');
            }

            // Criar FormData para upload
            const uploadData = new FormData();
            uploadData.append('funcionario_id', formData.funcionario_id);
            
            if (formData.carro_id) {
                uploadData.append('carro_id', formData.carro_id);
            }
            
            if (formData.moto_id) {
                uploadData.append('moto_id', formData.moto_id);
            }
            
            if (formData.data_publicacao) {
                uploadData.append('data_publicacao', formData.data_publicacao);
            }
            
            // Adicionar imagens se selecionadas
            if (formData.imagem1) {
                uploadData.append('imagem1', formData.imagem1);
            }
            if (formData.imagem2) {
                uploadData.append('imagem2', formData.imagem2);
            }
            if (formData.imagem3) {
                uploadData.append('imagem3', formData.imagem3);
            }

            // Enviar para API
            const response = await fetch(`${API_BASE_URL}/api/v1/anuncios/create-with-images`, {
                method: 'POST',
                body: uploadData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Erro ao criar anúncio');
            }

            alert('Anúncio criado com sucesso!');
            navigate('/anuncios');
            
        } catch (err) {
            setError(err.message || 'Erro ao criar anúncio');
            console.error('Erro:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-header">
                            <h3 className="card-title mb-0">Criar Novo Anúncio</h3>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Funcionário */}
                                <div className="mb-3">
                                    <label htmlFor="funcionario_id" className="form-label">
                                        Funcionário *
                                    </label>
                                    <select
                                        id="funcionario_id"
                                        name="funcionario_id"
                                        className="form-select"
                                        value={formData.funcionario_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Selecione um funcionário</option>
                                        {funcionarios.map(func => (
                                            <option key={func.id} value={func.id}>
                                                {func.usuario?.nome || `Funcionário ${func.id}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Veículo */}
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="carro_id" className="form-label">
                                                Carro
                                            </label>
                                            <select
                                                id="carro_id"
                                                name="carro_id"
                                                className="form-select"
                                                value={formData.carro_id}
                                                onChange={handleInputChange}
                                                disabled={formData.moto_id}
                                            >
                                                <option value="">Selecione um carro</option>
                                                {carros.map(carro => (
                                                    <option key={carro.id} value={carro.id}>
                                                        {carro.marca} {carro.modelo} ({carro.ano})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="moto_id" className="form-label">
                                                Moto
                                            </label>
                                            <select
                                                id="moto_id"
                                                name="moto_id"
                                                className="form-select"
                                                value={formData.moto_id}
                                                onChange={handleInputChange}
                                                disabled={formData.carro_id}
                                            >
                                                <option value="">Selecione uma moto</option>
                                                {motos.map(moto => (
                                                    <option key={moto.id} value={moto.id}>
                                                        {moto.marca} {moto.modelo} ({moto.ano})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Data de publicação */}
                                <div className="mb-3">
                                    <label htmlFor="data_publicacao" className="form-label">
                                        Data de Publicação
                                    </label>
                                    <input
                                        type="date"
                                        id="data_publicacao"
                                        name="data_publicacao"
                                        className="form-control"
                                        value={formData.data_publicacao}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Upload de imagens */}
                                <div className="mb-4">
                                    <label className="form-label">
                                        Imagens do Anúncio
                                    </label>
                                    <div className="row">
                                        {[1, 2, 3].map(num => (
                                            <div key={num} className="col-md-4">
                                                <div className="mb-3">
                                                    <label htmlFor={`imagem${num}`} className="form-label">
                                                        Imagem {num}
                                                    </label>
                                                    <input
                                                        type="file"
                                                        id={`imagem${num}`}
                                                        name={`imagem${num}`}
                                                        className="form-control"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                    {previews[`imagem${num}`] && (
                                                        <div className="mt-2 position-relative">
                                                            <img
                                                                src={previews[`imagem${num}`]}
                                                                alt={`Preview ${num}`}
                                                                className="img-fluid rounded"
                                                                style={{maxHeight: '150px'}}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                                                onClick={() => removeImage(`imagem${num}`)}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Botões */}
                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Criando...
                                            </>
                                        ) : (
                                            'Criar Anúncio'
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/anuncios')}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnuncioForm;
