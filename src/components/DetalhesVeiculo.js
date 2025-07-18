import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function DetalhesVeiculo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tipoVeiculo, setTipoVeiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anuncio, setAnuncio] = useState(null);
  const [veiculo, setVeiculo] = useState(null);

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

  if (loading) return <div className="container py-5">Carregando detalhes...</div>;
  if (error) return <div className="container py-5 text-danger">{error}</div>;

  const images = [anuncio.imagem1_url, anuncio.imagem2_url, anuncio.imagem3_url].filter(Boolean);

  return (
    <div className="container py-5">
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-4">Voltar</button>
      <h2 className="mb-4 text-capitalize">{tipoVeiculo} Detalhes</h2>
      <div className="row">
        <div className="col-md-6">
          {images.length > 0 ? (
            <img src={images[0]} alt="Imagem principal" className="img-fluid rounded mb-3" />
          ) : (
            <div className="bg-secondary text-white p-5 text-center">Sem imagem</div>
          )}
          <div className="d-flex gap-2">
            {images.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Imagem ${idx + 1}`}
                className="img-thumbnail"
                style={{ width: 100, cursor: 'pointer' }}
                onClick={() => window.open(url, '_blank')}
              />
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <ul className="list-group">
            <li className="list-group-item"><strong>Marca:</strong> {veiculo.marca}</li>
            <li className="list-group-item"><strong>Modelo:</strong> {veiculo.modelo}</li>
            <li className="list-group-item"><strong>Ano:</strong> {veiculo.ano}</li>
            {tipoVeiculo === 'carro' && (
              <>
                <li className="list-group-item"><strong>Cor:</strong> {veiculo.cor}</li>
                <li className="list-group-item"><strong>Combustível:</strong> {veiculo.tipo_combustivel}</li>
                <li className="list-group-item"><strong>Disponível:</strong> {veiculo.disponivel ? 'Sim' : 'Não'}</li>
              </>
            )}
            {tipoVeiculo === 'moto' && (
              <>
                <li className="list-group-item"><strong>Freio Dianteiro:</strong> {veiculo.freio_dianteiro}</li>
                <li className="list-group-item"><strong>Freio Traseiro:</strong> {veiculo.freio_traseiro}</li>
                <li className="list-group-item"><strong>Estilo:</strong> {veiculo.estilo}</li>
                <li className="list-group-item"><strong>Cilindradas:</strong> {veiculo.cilindradas}</li>
                <li className="list-group-item"><strong>Velocidade Máx.:</strong> {veiculo.velocidade_max}</li>
              </>
            )}
            <li className="list-group-item"><strong>Preço:</strong> R$ {parseFloat(veiculo.preco).toLocaleString('pt-BR')}</li>
            <li className="list-group-item"><strong>Data Publicação:</strong> {anuncio.data_publicacao}</li>
            <li className="list-group-item"><strong>Tipo:</strong> {tipoVeiculo === 'carro' ? 'Carro' : 'Moto'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DetalhesVeiculo;
