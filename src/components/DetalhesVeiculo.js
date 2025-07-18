import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DetalhesVeiculo.css';

function DetalhesVeiculo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tipoVeiculo, setTipoVeiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anuncio, setAnuncio] = useState(null);
  const [veiculo, setVeiculo] = useState(null);
  const [imagemPrincipal, setImagemPrincipal] = useState(0);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const resAn = await fetch(`${API_BASE_URL}/api/v1/anuncios/get/${id}`);
        if (!resAn.ok) throw new Error('Erro ao buscar anúncio');
        const anData = await resAn.json();
        setAnuncio(anData);
        // Detectar tipo real de veículo do anúncio
        const actualTipo = anData.carro_id ? 'carro' : 'moto';
        setTipoVeiculo(actualTipo);
        const veiculoId = actualTipo === 'carro' ? anData.carro_id : anData.moto_id;
        const endpoint = actualTipo === 'carro' ? 'carros' : 'motos';
        const resVe = await fetch(`${API_BASE_URL}/api/v1/${endpoint}/get/${veiculoId}`);
        if (!resVe.ok) throw new Error('Erro ao buscar veículo');
        const veData = await resVe.json();
        setVeiculo(veData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_BASE_URL, id]);

  if (loading) return (
    <div className="container py-5">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-3">Carregando detalhes do veículo...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container py-5">
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Erro!</h4>
        <p>{error}</p>
        <button className="btn btn-outline-danger" onClick={() => navigate(-1)}>
          Voltar
        </button>
      </div>
    </div>
  );

  const images = [anuncio.imagem1_url, anuncio.imagem2_url, anuncio.imagem3_url].filter(Boolean);
  const imagemAtual = images[imagemPrincipal] || '/api/placeholder/600/400';

  const handleInteresse = () => {
    alert('Interesse registrado! Entraremos em contato em breve.');
  };

  const handleTestDrive = () => {
    alert('Test drive agendado! Entraremos em contato para confirmar.');
  };

  const handleWhatsApp = () => {
    const phone = '5561999999999';
    const message = `Olá! Tenho interesse no ${veiculo.marca} ${veiculo.modelo} ${veiculo.ano} por R$ ${parseFloat(veiculo.preco).toLocaleString('pt-BR')}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="detalhes-veiculo">
      {/* Header com breadcrumb */}
      <div className="container-fluid bg-light py-3">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <button className="btn btn-link p-0 text-decoration-none" onClick={() => navigate('/')}>
                  Início
                </button>
              </li>
              <li className="breadcrumb-item">
                <button className="btn btn-link p-0 text-decoration-none" onClick={() => navigate(-1)}>
                  Veículos
                </button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {veiculo.marca} {veiculo.modelo}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container py-4">
        {/* Título principal */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h1 className="display-5 fw-bold text-primary mb-2">
                  {veiculo.marca} {veiculo.modelo} {veiculo.ano}
                </h1>
                <div className="d-flex gap-2 mb-3">
                  <span className="badge bg-success fs-6">
                    {veiculo.disponivel ? 'Disponível' : 'Indisponível'}
                  </span>
                  {veiculo.revisado && (
                    <span className="badge bg-info fs-6">
                      <i className="fas fa-check-circle me-1"></i>
                      Revisado
                    </span>
                  )}
                  <span className="badge bg-secondary fs-6">
                    <i className="fas fa-car me-1"></i>
                    {tipoVeiculo === 'carro' ? 'Carro' : 'Moto'}
                  </span>
                </div>
              </div>
              <div className="text-end">
                <div className="price-tag">
                  <span className="price-label">Preço</span>
                  <span className="price-value">
                    R$ {parseFloat(veiculo.preco).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Galeria de imagens */}
          <div className="col-lg-7 mb-4">
            <div className="image-gallery">
              <div className="main-image-container">
                <img
                  src={imagemAtual}
                  alt={`${veiculo.marca} ${veiculo.modelo}`}
                  className="main-image"
                />
                <div className="image-overlay">
                  <button
                    className="btn btn-light btn-sm"
                    onClick={() => window.open(imagemAtual, '_blank')}
                  >
                    <i className="fas fa-expand"></i>
                  </button>
                </div>
              </div>
              
              {images.length > 1 && (
                <div className="thumbnails-container">
                  {images.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Imagem ${idx + 1}`}
                      className={`thumbnail ${idx === imagemPrincipal ? 'active' : ''}`}
                      onClick={() => setImagemPrincipal(idx)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Botões de ação */}
            <div className="action-buttons mt-4">
              <button
                className="btn btn-primary btn-lg me-3"
                onClick={handleInteresse}
              >
                <i className="fas fa-heart me-2"></i>
                Demonstrar Interesse
              </button>
              <button
                className="btn btn-outline-primary btn-lg me-3"
                onClick={handleTestDrive}
              >
                <i className="fas fa-key me-2"></i>
                Agendar Test Drive
              </button>
              <button
                className="btn btn-success btn-lg"
                onClick={handleWhatsApp}
              >
                <i className="fab fa-whatsapp me-2"></i>
                WhatsApp
              </button>
            </div>
          </div>

          {/* Especificações */}
          <div className="col-lg-5">
            <div className="specs-container">
              <h3 className="specs-title">
                <i className="fas fa-cogs me-2"></i>
                Especificações
              </h3>
              
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Marca</span>
                  <span className="spec-value">{veiculo.marca}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Modelo</span>
                  <span className="spec-value">{veiculo.modelo}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Ano</span>
                  <span className="spec-value">{veiculo.ano}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Cor</span>
                  <span className="spec-value">{veiculo.cor}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Combustível</span>
                  <span className="spec-value">{veiculo.tipo_combustivel}</span>
                </div>

                {tipoVeiculo === 'carro' && (
                  <>
                    <div className="spec-item">
                      <span className="spec-label">Direção</span>
                      <span className="spec-value">{veiculo.tipo_direcao}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Tração</span>
                      <span className="spec-value">{veiculo.tracao}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Consumo Cidade</span>
                      <span className="spec-value">{veiculo.consumo_cidade} km/l</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Airbag</span>
                      <span className="spec-value">
                        {veiculo.airbag ? (
                          <i className="fas fa-check text-success"></i>
                        ) : (
                          <i className="fas fa-times text-danger"></i>
                        )}
                      </span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Ar Condicionado</span>
                      <span className="spec-value">
                        {veiculo.ar_condicionado ? (
                          <i className="fas fa-check text-success"></i>
                        ) : (
                          <i className="fas fa-times text-danger"></i>
                        )}
                      </span>
                    </div>
                  </>
                )}

                {tipoVeiculo === 'moto' && (
                  <>
                    <div className="spec-item">
                      <span className="spec-label">Freio Dianteiro</span>
                      <span className="spec-value">{veiculo.freio_dianteiro}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Freio Traseiro</span>
                      <span className="spec-value">{veiculo.freio_traseiro}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Estilo</span>
                      <span className="spec-value">{veiculo.estilo}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Cilindradas</span>
                      <span className="spec-value">{veiculo.cilindradas}cc</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Velocidade Máxima</span>
                      <span className="spec-value">{veiculo.velocidade_max} km/h</span>
                    </div>
                  </>
                )}
              </div>

              <div className="publication-info">
                <h4 className="mb-3">
                  <i className="fas fa-calendar-alt me-2"></i>
                  Informações da Publicação
                </h4>
                <p className="mb-2">
                  <strong>Publicado em:</strong> {new Date(anuncio.data_publicacao).toLocaleDateString('pt-BR')}
                </p>
                <p className="mb-0">
                  <strong>Código do anúncio:</strong> #{anuncio.id}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa da localização */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="location-section">
              <h3 className="section-title">
                <i className="fas fa-map-marker-alt me-2"></i>
                Localização da Concessionária
              </h3>
              <div className="row">
                <div className="col-md-8">
                  <div className="map-container">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3838.8582767406344!2d-47.88234068537384!3d-15.79463528842159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a3a4b1a5b3b3b%3A0x1234567890123456!2sBrasilia%2C%20DF!5e0!3m2!1spt-BR!2sbr!4v1234567890123"
                      width="100%"
                      height="300"
                      style={{ border: 0, borderRadius: '10px' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Localização da Concessionária"
                    ></iframe>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="contact-info">
                    <h4 className="mb-3">Autocampos Concessionária</h4>
                    <div className="contact-item">
                      <i className="fas fa-map-marker-alt text-primary me-2"></i>
                      <span>SIA Trecho 1, Lote 1155 - Brasília/DF</span>
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-phone text-primary me-2"></i>
                      <span>(61) 3333-4444</span>
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-envelope text-primary me-2"></i>
                      <span>contato@autocampos.com</span>
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-clock text-primary me-2"></i>
                      <span>Segunda à Sexta: 8h às 18h<br />Sábado: 8h às 14h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhesVeiculo;
