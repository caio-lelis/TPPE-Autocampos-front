import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

function Home_geral() {
  const [veiculos, setVeiculos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setVeiculos(veiculosMock);
  }, []);

  const veiculosFiltrados = veiculos.filter(v =>
    v.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  const formatarPreco = valor =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Cabeçalho */}
      <header style={{
        background: '#2a5298',
        color: 'white',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>AutoCampos</h1>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'white',
            color: '#2a5298',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </header>

      {/* Campo de busca */}
      <div style={{ maxWidth: 600, margin: '32px auto', padding: '0 16px' }}>
        <input
          type="text"
          placeholder="Buscar veículos..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 8,
            border: '1px solid #ccc',
            fontSize: 16,
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Listagem de veículos */}
      <div style={{ padding: '0 32px' }}>
        {['carro', 'moto'].map(tipo => (
          <div key={tipo}>
            <h2 style={{ color: '#2a5298', marginBottom: 16 }}>
              {tipo === 'carro' ? 'Carros' : 'Motos'}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              justifyItems: 'center',
              gap: '12px 8px',
              marginBottom: 40,
            }}>
              {veiculosFiltrados.filter(v => v.tipo === tipo).map(veiculo => (
                <div key={veiculo.id} style={{
                  background: 'white',
                  borderRadius: 8,
                  padding: 12,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  fontSize: 14,
                  maxWidth: 220,
                }}>
                  <img src={veiculo.imagem} alt={veiculo.nome} style={{
                    width: '100%',
                    height: 100,
                    objectFit: 'contain',
                    marginBottom: 8,
                  }} />
                  <h3 style={{ margin: '0 0 6px 0', fontSize: 16, color: '#1e3c72' }}>{veiculo.nome}</h3>
                  <p style={{ fontSize: 13, color: '#555', minHeight: 30 }}>{veiculo.descricao}</p>
                  <p style={{ fontWeight: '700', color: '#2a5298', margin: '6px 0' }}>
                    {formatarPreco(veiculo.preco)}
                  </p>
                  <button style={{
                    background: '#2a5298',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    padding: '6px 10px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                    onClick={() => alert(`Detalhes do: ${veiculo.nome}`)}
                  >
                    Ver detalhes
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home_geral;
