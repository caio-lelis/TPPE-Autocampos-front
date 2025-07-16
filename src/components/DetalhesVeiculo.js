import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const veiculosMock = [
  {
    id: 1,
    tipo: 'carro',
    nome: 'Honda Civic 2020',
    descricao: 'Sedan confortável, econômico e com ótimo desempenho.',
    preco: 85000,
    imagem: 'https://cdn-icons-png.flaticon.com/512/743/743007.png',
  },
  {
    id: 2,
    tipo: 'moto',
    nome: 'Yamaha YZF R3',
    descricao: 'Moto esportiva, ideal para quem busca agilidade e estilo.',
    preco: 27000,
    imagem: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
  },
  {
    id: 3,
    tipo: 'carro',
    nome: 'Ford Ka 2019',
    descricao: 'Compacto, ideal para uso urbano e fácil de estacionar.',
    preco: 45000,
    imagem: 'https://cdn-icons-png.flaticon.com/512/743/743007.png',
  },
  {
    id: 4,
    tipo: 'moto',
    nome: 'Honda CB 500X',
    descricao: 'Moto para aventura, confortável e robusta.',
    preco: 32000,
    imagem: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
  },
];

function DetalhesVeiculo() {
  const { tipo, id } = useParams();
  const navigate = useNavigate();
  const veiculo = veiculosMock.find(v => v.id === parseInt(id, 10) && v.tipo === tipo);

  if (!veiculo) {
    return (
      <div style={{ fontFamily: "'Segoe UI', sans-serif", padding: 20, textAlign: 'center' }}>
        <h2>Veículo não encontrado</h2>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">Voltar</button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", padding: 20 }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-4">Voltar</button>
      <div className="card mx-auto" style={{ maxWidth: 600, borderRadius: 12, background: '#fffde7', border: '2px solid #FFD600' }}>
        <img src={veiculo.imagem} alt={veiculo.nome} className="card-img-top p-4" style={{ height: 300, objectFit: 'contain' }} />
        <div className="card-body">
          <h3 className="card-title fw-bold" style={{ color: '#111' }}>{veiculo.nome}</h3>
          <p className="card-text text-secondary" style={{ color: '#333' }}>{veiculo.descricao}</p>
          <h4 style={{ fontWeight: 700, color: '#111' }}>{formatarPreco(veiculo.preco)}</h4>
        </div>
      </div>
    </div>
  );
}

function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default DetalhesVeiculo;
