import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Anuncios() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroMarca, setFiltroMarca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [marcas, setMarcas] = useState([]);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';
  const navigate = useNavigate();

  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchAnuncios();
  }, []);

  const fetchAnuncios = async () => {
    try {
      console.log('Carregando anúncios via API:', `${API_BASE_URL}/api/v1/anuncios/get`);
      setLoading(true);
      console.log('Iniciando requisição fetch');
      const response = await fetch(`${API_BASE_URL}/api/v1/anuncios/get`);
      console.log('Resposta fetch:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Dados recebidos:', data);
      // Enriquecer dados com detalhes de carro e moto
      const enrichedAnuncios = await Promise.all(data.map(async anuncio => {
        if (anuncio.carro_id) {
          const resCar = await fetch(`${API_BASE_URL}/api/v1/carros/get/${anuncio.carro_id}`);
          if (resCar.ok) anuncio.carro = await resCar.json();
        }
        if (anuncio.moto_id) {
          const resMoto = await fetch(`${API_BASE_URL}/api/v1/motos/get/${anuncio.moto_id}`);
          if (resMoto.ok) anuncio.moto = await resMoto.json();
        }
        return anuncio;
      }));
      setAnuncios(enrichedAnuncios);
      
      // Extrair marcas únicas para o filtro com dados enriquecidos
      const uniqueMarcas = [...new Set(enrichedAnuncios.map(anuncio => {
        if (anuncio.carro) return anuncio.carro.marca;
        if (anuncio.moto) return anuncio.moto.marca;
        return null;
      }).filter(Boolean))];
      setMarcas(uniqueMarcas);
    } catch (e) {
      setError("Falha ao carregar anúncios: " + e.message);
      console.error("Erro ao buscar anúncios:", e);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros de tipo e marca
  const filteredAnuncios = anuncios.filter(anuncio => {
    const vehicleInfo = getVehicleInfo(anuncio);
    if (!vehicleInfo) return false;
    if (filtroTipo && vehicleInfo.tipo.toLowerCase() !== filtroTipo.toLowerCase()) return false;
    if (filtroMarca && !vehicleInfo.marca.toLowerCase().includes(filtroMarca.toLowerCase())) return false;
    return true;
  });
  console.log('Anúncios após filtro:', filteredAnuncios);

  function getVehicleInfo(anuncio) {
    if (anuncio.carro) {
      return {
        marca: anuncio.carro.marca,
        modelo: anuncio.carro.modelo,
        ano: anuncio.carro.ano,
        preco: anuncio.carro.preco,
        tipo: 'Carro'
      };
    }
    if (anuncio.moto) {
      return {
        marca: anuncio.moto.marca,
        modelo: anuncio.moto.modelo,
        ano: anuncio.moto.ano,
        preco: anuncio.moto.preco,
        tipo: 'Moto'
      };
    }
    return null;
  }

  function getFirstImage(anuncio) {
    // Retorna a primeira imagem disponível do anúncio
    if (anuncio.imagem1_url) return anuncio.imagem1_url;
    if (anuncio.imagem2_url) return anuncio.imagem2_url;
    if (anuncio.imagem3_url) return anuncio.imagem3_url;
    
    // Imagem padrão se não houver nenhuma
    return "https://via.placeholder.com/400x200?text=Sem+Imagem";
  }

  function getImageGallery(anuncio) {
    // Retorna todas as imagens do anúncio
    return [
      anuncio.imagem1_url,
      anuncio.imagem2_url,
      anuncio.imagem3_url
    ].filter(Boolean);
  }

  if (loading) return <div className="container py-5">Carregando anúncios...</div>;
  if (error) return <div className="container py-5 text-danger">{error}</div>;

  return (
    <div className='container py-5'>
      {/* Debug: cartes */}
      <h2 className='mb-4'>Veículos à Venda</h2>
      
      {/* Filtros de Tipo e Marca */}
      <div className='mb-4 d-flex gap-2'>
        <select
          className='form-select'
          style={{ maxWidth: '200px' }}
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
        >
          <option value="">Todos Tipos</option>
          <option value="Carro">Carro</option>
          <option value="Moto">Moto</option>
        </select>
        <select
          className='form-select'
          style={{ maxWidth: '200px' }}
          value={filtroMarca}
          onChange={e => setFiltroMarca(e.target.value)}
        >
          <option value="">Todas Marcas</option>
          {marcas.map(marca => (
            <option key={marca} value={marca}>{marca}</option>
          ))}
        </select>
      </div>

      {/* Lista de anúncios */}
      {filteredAnuncios.length === 0 ? (
        <p>Nenhum anúncio encontrado.</p>
      ) : (
        <div className='row g-4'>
          {filteredAnuncios.map(anuncio => {
            const vehicleInfo = getVehicleInfo(anuncio);
            const mainImage = getFirstImage(anuncio);
            const imageGallery = getImageGallery(anuncio);
            
            if (!vehicleInfo) return null;

            return (
              <div key={anuncio.id} className='col-md-4'>
                <div className='card h-100 shadow-sm'>
                  <div style={{position: 'relative'}}>
                    <img 
                      src={mainImage} 
                      alt={`${vehicleInfo.marca} ${vehicleInfo.modelo}`}
                      className="card-img-top"
                      style={{height:'200px', objectFit:'cover'}}
                    />
                    
                    {/* Badge do tipo de veículo */}
                    <span 
                      className={`badge position-absolute top-0 start-0 m-2 ${
                        vehicleInfo.tipo === 'Carro' ? 'bg-primary' : 'bg-success'
                      }`}
                    >
                      {vehicleInfo.tipo}
                    </span>
                    
                    {/* Indicador de múltiplas imagens */}
                    {imageGallery.length > 1 && (
                      <span className="badge bg-dark position-absolute top-0 end-0 m-2">
                        📷 {imageGallery.length}
                      </span>
                    )}
                  </div>
                  
                  <div className='card-body'>
                    <h5 className="card-title">
                      {vehicleInfo.marca} {vehicleInfo.modelo}
                    </h5>
                    <p className="card-text">
                      <small className="text-muted">Ano: {vehicleInfo.ano}</small><br/>
                      <strong className="text-success">
                        R$ {parseFloat(vehicleInfo.preco).toLocaleString('pt-BR')}
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
                                width: '30px',
                                height: '30px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                cursor: 'pointer'
                              }}
                              onClick={() => window.open(imageUrl, '_blank')}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="d-flex gap-2">
                      <button 
                        className='btn btn-outline-primary btn-sm flex-fill'
                        onClick={() => window.open(mainImage, '_blank')}
                      >
                        Ver Imagem
                      </button>
                      <button
                        className='btn btn-primary btn-sm flex-fill'
                        onClick={() => navigate(`/detalhes/${vehicleInfo.tipo.toLowerCase()}/${anuncio.id}`)}
                      >
                        Detalhes
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

export default Anuncios;
