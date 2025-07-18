import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AnunciosPublicos() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    fetchAnuncios();
  }, []);

  const fetchAnuncios = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/anuncios/get`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAnuncios(data);
    } catch (e) {
      setError("Falha ao carregar anúncios: " + e.message);
      console.error("Erro ao buscar anúncios:", e);
    } finally {
      setLoading(false);
    }
  };

  const getVehicleInfo = (anuncio) => {
    if (anuncio.carro) {
      return {
        marca: anuncio.carro.marca,
        modelo: anuncio.carro.modelo,
        ano: anuncio.carro.ano,
        preco: anuncio.carro.preco,
        tipo: 'Carro',
        id: anuncio.carro.id
      };
    }
    if (anuncio.moto) {
      return {
        marca: anuncio.moto.marca,
        modelo: anuncio.moto.modelo,
        ano: anuncio.moto.ano,
        preco: anuncio.moto.preco,
        tipo: 'Moto',
        id: anuncio.moto.id
      };
    }
    return null;
  };

  const getFirstImage = (anuncio) => {
    if (anuncio.imagem1_url) return anuncio.imagem1_url;
    if (anuncio.imagem2_url) return anuncio.imagem2_url;
    if (anuncio.imagem3_url) return anuncio.imagem3_url;
    
    // Imagem padrão baseada no tipo
    const vehicleInfo = getVehicleInfo(anuncio);
    if (vehicleInfo?.tipo === 'Carro') {
      return 'https://cdn-icons-png.flaticon.com/512/743/743007.png';
    } else {
      return 'https://cdn-icons-png.flaticon.com/512/616/616408.png';
    }
  };

  const getImageGallery = (anuncio) => {
    return [
      anuncio.imagem1_url,
      anuncio.imagem2_url,
      anuncio.imagem3_url
    ].filter(Boolean);
  };

  const handleVerDetalhes = (anuncio) => {
    const vehicleInfo = getVehicleInfo(anuncio);
    if (vehicleInfo) {
      navigate(`/detalhes/${vehicleInfo.tipo.toLowerCase()}/${vehicleInfo.id}`);
    }
  };

  const formatarPreco = (valor) => {
    return parseFloat(valor).toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  const anunciosFiltrados = anuncios.filter(anuncio => {
    const vehicleInfo = getVehicleInfo(anuncio);
    if (!vehicleInfo) return false;
    
    const nome = `${vehicleInfo.marca} ${vehicleInfo.modelo}`;
    return nome.toLowerCase().includes(filtro.toLowerCase());
  });

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3">Carregando veículos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">Aviso</h4>
          <p>Não foi possível carregar os anúncios do servidor. Verifique se o backend está rodando.</p>
          <hr />
          <p className="mb-0 text-muted">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Campo de busca */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-8 col-lg-6">
          <div className="input-group shadow-sm">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar veículo por marca ou modelo..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              style={{
                borderRadius: '12px 0 0 12px',
                border: '2px solid #FFD600',
                fontSize: '16px'
              }}
            />
            <button
              className="btn"
              type="button"
              style={{
                background: '#FFD600',
                color: '#111',
                border: '2px solid #FFD600',
                borderRadius: '0 12px 12px 0',
                fontWeight: '600'
              }}
            >
              🔍
            </button>
          </div>
        </div>
      </div>

      {/* Lista de veículos */}
      {anunciosFiltrados.length === 0 ? (
        <div className="text-center py-5">
          <h4>Nenhum veículo encontrado</h4>
          <p className="text-muted">
            {filtro ? 'Tente ajustar os filtros de busca.' : 'Não há anúncios disponíveis no momento.'}
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {anunciosFiltrados.map(anuncio => {
            const vehicleInfo = getVehicleInfo(anuncio);
            const mainImage = getFirstImage(anuncio);
            const imageGallery = getImageGallery(anuncio);
            
            if (!vehicleInfo) return null;

            return (
              <div key={anuncio.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={mainImage} 
                      alt={`${vehicleInfo.marca} ${vehicleInfo.modelo}`}
                      className="card-img-top"
                      style={{
                        height: '200px', 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    />
                    
                    {/* Badge do tipo */}
                    <span 
                      className={`badge position-absolute top-0 start-0 m-3 ${
                        vehicleInfo.tipo === 'Carro' ? 'bg-primary' : 'bg-success'
                      }`}
                      style={{ fontSize: '12px', borderRadius: '8px' }}
                    >
                      {vehicleInfo.tipo}
                    </span>
                    
                    {/* Indicador de múltiplas imagens */}
                    {imageGallery.length > 1 && (
                      <span 
                        className="badge bg-dark position-absolute top-0 end-0 m-3"
                        style={{ fontSize: '12px', borderRadius: '8px' }}
                      >
                        📷 {imageGallery.length}
                      </span>
                    )}
                  </div>
                  
                  <div className="card-body p-4">
                    <h5 className="card-title mb-2" style={{ color: '#333' }}>
                      {vehicleInfo.marca} {vehicleInfo.modelo}
                    </h5>
                    <p className="card-text mb-3">
                      <small className="text-muted">Ano: {vehicleInfo.ano}</small><br/>
                      <strong className="text-success fs-5">
                        {formatarPreco(vehicleInfo.preco)}
                      </strong>
                    </p>
                    
                    {/* Galeria de imagens em miniatura */}
                    {imageGallery.length > 1 && (
                      <div className="mb-3">
                        <div className="d-flex gap-1 flex-wrap">
                          {imageGallery.slice(0, 3).map((imageUrl, index) => (
                            <img
                              key={index}
                              src={imageUrl}
                              alt={`Imagem ${index + 1}`}
                              style={{
                                width: '35px',
                                height: '35px',
                                objectFit: 'cover',
                                borderRadius: '6px',
                                border: '2px solid #ddd',
                                cursor: 'pointer'
                              }}
                              onClick={() => window.open(imageUrl, '_blank')}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="d-grid">
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => handleVerDetalhes(anuncio)}
                        style={{ borderRadius: '12px' }}
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AnunciosPublicos;
