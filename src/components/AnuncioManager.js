import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnuncioManager = () => {
    const [anuncios, setAnuncios] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [carros, setCarros] = useState([]);
    const [motos, setMotos] = useState([]);
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

    // Buscar anúncios existentes
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    useEffect(() => {
        fetchAnuncios();
    }, []);

    const fetchAnuncios = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/anuncios/get`);
            setAnuncios(response.data);
            // fetch reference data
            const [resFun, resCar, resMoto] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/v1/funcionarios/get`),
                axios.get(`${API_BASE_URL}/api/v1/carros/get`),
                axios.get(`${API_BASE_URL}/api/v1/motos/get`)
            ]);
            setFuncionarios(resFun.data);
            setCarros(resCar.data);
            setMotos(resMoto.data);
        } catch (err) {
            setError('Erro ao carregar anúncios');
            console.error('Erro:', err);
        }
    };

    // Manipular mudanças no formulário
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Manipular upload de imagens
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

    // Submeter formulário
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
            await axios.post(
                `${API_BASE_URL}/api/v1/anuncios/create-with-images`,
                uploadData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            // Resetar formulário
            setFormData({
                funcionario_id: '',
                carro_id: '',
                moto_id: '',
                data_publicacao: '',
                imagem1: null,
                imagem2: null,
                imagem3: null
            });
            
            setPreviews({
                imagem1: null,
                imagem2: null,
                imagem3: null
            });

            // Atualizar lista de anúncios
            fetchAnuncios();
            
            alert('Anúncio criado com sucesso!');
            
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Erro ao criar anúncio');
            console.error('Erro:', err);
        } finally {
            setLoading(false);
        }
    };

    // Adicionar função de exclusão de anúncio
    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este anúncio?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/v1/anuncios/delete/${id}`);
            setAnuncios(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            console.error('Erro ao excluir anúncio:', err);
            setError('Erro ao excluir anúncio');
        }
    };

    // Componente para exibir imagens do anúncio
    const ImageGallery = ({ anuncio }) => {
        const images = [
            anuncio.imagem1_url,
            anuncio.imagem2_url,
            anuncio.imagem3_url
        ].filter(Boolean);

        if (images.length === 0) {
            return <div style={styles.noImages}>Nenhuma imagem disponível</div>;
        }

        return (
            <div style={styles.imageGallery}>
                {images.map((imageUrl, index) => (
                    <img
                        key={index}
                        src={imageUrl}
                        alt={`Imagem ${index + 1}`}
                        style={styles.thumbnailImage}
                        onClick={() => window.open(imageUrl, '_blank')}
                    />
                ))}
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Gerenciamento de Anúncios</h1>
            
            {/* Formulário de criação */}
            <div style={styles.formSection}>
                <h2>Criar Novo Anúncio</h2>
                
                {error && <div style={styles.error}>{error}</div>}
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Funcionário:</label>
                        <select
                            name="funcionario_id"
                            value={formData.funcionario_id}
                            onChange={handleInputChange}
                            style={styles.input}
                            required
                        >
                            <option value="">Selecione funcionário</option>
                            {funcionarios.map(f => (
                                <option key={f.id} value={f.id}>{f.usuario?.nome || `Funcionário #${f.id}`}</option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Carro:</label>
                        <select
                            name="carro_id"
                            value={formData.carro_id}
                            onChange={handleInputChange}
                            style={styles.input}
                        >
                            <option value="">Selecione carro</option>
                            {carros.map(c => (
                                <option key={c.id} value={c.id}>{c.marca} {c.modelo} (#{c.id})</option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Moto:</label>
                        <select
                            name="moto_id"
                            value={formData.moto_id}
                            onChange={handleInputChange}
                            style={styles.input}
                        >
                            <option value="">Selecione moto</option>
                            {motos.map(m => (
                                <option key={m.id} value={m.id}>{m.marca} {m.modelo} (#{m.id})</option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Data de Publicação:</label>
                        <input
                            type="date"
                            name="data_publicacao"
                            value={formData.data_publicacao}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                    </div>

                    {/* Upload de imagens */}
                    <div style={styles.imageUploadSection}>
                        <h3>Imagens do Anúncio</h3>
                        
                        {[1, 2, 3].map(num => (
                            <div key={num} style={styles.imageUploadGroup}>
                                <label style={styles.label}>Imagem {num}:</label>
                                <input
                                    type="file"
                                    name={`imagem${num}`}
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={styles.fileInput}
                                />
                                {previews[`imagem${num}`] && (
                                    <img
                                        src={previews[`imagem${num}`]}
                                        alt={`Preview ${num}`}
                                        style={styles.previewImage}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.submitButton,
                            opacity: loading ? 0.6 : 1
                        }}
                    >
                        {loading ? 'Criando...' : 'Criar Anúncio'}
                    </button>
                </form>
            </div>

            {/* Lista de anúncios em cards */}
            <div className="container py-5">
                <h2 className="mb-4">Anúncios Cadastrados</h2>
                {anuncios.length === 0 ? (
                    <p>Nenhum anúncio encontrado.</p>
                ) : (
                    <div className="row g-4">
                        {anuncios.map(anuncio => {
                            const mainImage = anuncio.imagem1_url || anuncio.imagem2_url || anuncio.imagem3_url || 'https://via.placeholder.com/400x200?text=Sem+Imagem';
                            return (
                                <div key={anuncio.id} className="col-md-4">
                                    <div className="card h-100 shadow-sm position-relative">
                                        {/* Botão de exclusão sobreposto no canto */}
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(anuncio.id)}
                                            style={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                                background: 'rgba(255,255,255,0.8)',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: 30,
                                                height: 30,
                                                padding: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer'
                                            }}
                                            title="Excluir anúncio"
                                        >
                                            <span style={{ color: 'red', fontSize: 16, lineHeight: 1 }}>×</span>
                                        </button>
                                        <img
                                            src={mainImage}
                                            alt={`Anúncio ${anuncio.id}`}
                                            className="card-img-top"
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">Anúncio #{anuncio.id}</h5>
                                            <p className="card-text"><strong>Funcionário:</strong> {anuncio.funcionario_id}</p>
                                            <p className="card-text"><strong>Data:</strong> {anuncio.data_publicacao}</p>
                                            {/* Miniaturas de imagens */}
                                            <div className="d-flex gap-1 flex-wrap mb-2">
                                                <ImageGallery anuncio={anuncio} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '30px'
    },
    formSection: {
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    },
    label: {
        fontWeight: 'bold',
        color: '#333'
    },
    input: {
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px'
    },
    fileInput: {
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px'
    },
    imageUploadSection: {
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '15px',
        backgroundColor: '#fff'
    },
    imageUploadGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '15px'
    },
    previewImage: {
        width: '150px',
        height: '150px',
        objectFit: 'cover',
        border: '1px solid #ddd',
        borderRadius: '4px'
    },
    submitButton: {
        padding: '12px 24px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        alignSelf: 'flex-start'
    },
    error: {
        color: 'red',
        backgroundColor: '#ffebee',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '15px'
    },
    listSection: {
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px'
    },
    anunciosList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '20px'
    },
    anuncioCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    imageSection: {
        marginTop: '15px'
    },
    imageGallery: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
    },
    thumbnailImage: {
        width: '100px',
        height: '100px',
        objectFit: 'cover',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'transform 0.2s'
    },
    noImages: {
        color: '#666',
        fontStyle: 'italic',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px'
    }
};

export default AnuncioManager;
