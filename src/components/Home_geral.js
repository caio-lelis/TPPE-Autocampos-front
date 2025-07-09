import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Banner */}
      <div className="container-fluid p-0 mb-4">
        <div style={{
          background: 'linear-gradient(90deg, #FFD600 0%, #FFC107 100%)',
          color: '#111',
          padding: '40px 0 20px 0',
          position: 'relative',
          minHeight: 240,
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
          borderBottom: '8px solid #111',
        }}>
          {/* Apenas a logo centralizada */}
          {/* Botão login fixo no canto superior direito */}
          <button
            onClick={() => navigate('/login')}
            className="btn fw-bold px-4 py-2"
            style={{
              position: 'fixed',
              top: 48,
              right: 20,
              background: '#111',
              color: '#FFD600',
              borderRadius: 8,
              border: 'none',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
              zIndex: 2000,
              margin: 0
            }}
          >
            Login
          </button>
          {/* Logo centralizada */}
          <div className="w-100 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 120 }}>
            <img src="/logo.png" alt="AutoCampos Logo" style={{ maxHeight: 110, maxWidth: '90%', objectFit: 'contain', marginBottom: 8 }} />
            <p className="w-100 text-center" style={{ fontSize: 20, fontWeight: 400, marginBottom: 0 }}>Sua loja de carros e motos seminovos</p>
          </div>
        </div>
      </div>

      {/* Campo de busca */}
      <div className="container mb-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 position-relative">
            <input
              type="text"
              className="form-control form-control-lg shadow-sm"
              placeholder="Buscar veículos..."
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              style={{ borderRadius: 12, fontSize: 18, border: '2px solid #111', background: '#fffde7' }}
            />
            {/* Ícone de lupa */}
            <svg width="28" height="28" style={{ position: 'absolute', right: 18, top: 14 }} viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>
      </div>

      {/* Destaques */}
      <div className="container mb-5">
        <div className="row mb-4">
          <div className="col text-center">
            <h2 className="fw-bold" style={{ color: '#111', textShadow: '1px 1px 2px #FFD60022' }}>Destaques</h2>
            <p className="text-dark" style={{ color: '#111', fontWeight: 500 }}>Confira os veículos mais procurados!</p>
          </div>
        </div>
        <div className="row g-4">
          {veiculosFiltrados.slice(0, 3).map(veiculo => (
            <div className="col-md-4" key={veiculo.id}>
              <div className="card h-100 shadow border-0" style={{ borderRadius: 18, background: '#fffde7', border: '2px solid #FFD600' }}>
                <img src={veiculo.imagem} className="card-img-top p-4" alt={veiculo.nome} style={{ height: 160, objectFit: 'contain' }} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold" style={{ color: '#111' }}>{veiculo.nome}</h5>
                  <p className="card-text text-secondary" style={{ minHeight: 40, color: '#333' }}>{veiculo.descricao}</p>
                  <div className="mt-auto">
                    <span className="badge fs-6 mb-2" style={{ background: '#FFD600', color: '#111', fontWeight: 700, fontSize: 18 }}>{formatarPreco(veiculo.preco)}</span>
                    <button className="btn w-100 mt-2 fw-bold" style={{ borderRadius: 8, background: '#111', color: '#FFD600', border: 'none' }} onClick={() => alert(`Detalhes do: ${veiculo.nome}`)}>
                      Ver detalhes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Listagem de veículos por tipo */}
      <div className="container mb-5">
        {['carro', 'moto'].map(tipo => (
          <div key={tipo} className="mb-5">
            <h3 className="fw-bold mb-4" style={{ color: '#111', textShadow: '1px 1px 2px #FFD60022' }}>{tipo === 'carro' ? 'Carros' : 'Motos'}</h3>
            <div className="row g-4">
              {veiculosFiltrados.filter(v => v.tipo === tipo).map(veiculo => (
                <div className="col-md-3 col-sm-6" key={veiculo.id}>
                  <div className="card h-100 shadow border-0" style={{ borderRadius: 16, background: '#fffde7', border: '2px solid #FFD600' }}>
                    <img src={veiculo.imagem} className="card-img-top p-4" alt={veiculo.nome} style={{ height: 120, objectFit: 'contain' }} />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold" style={{ color: '#111' }}>{veiculo.nome}</h5>
                      <p className="card-text text-secondary" style={{ minHeight: 30, color: '#333' }}>{veiculo.descricao}</p>
                      <div className="mt-auto">
                        <span className="badge fs-6 mb-2" style={{ background: '#FFD600', color: '#111', fontWeight: 700, fontSize: 16 }}>{formatarPreco(veiculo.preco)}</span>
                        <button className="btn w-100 mt-2 fw-bold" style={{ borderRadius: 8, background: '#111', color: '#FFD600', border: 'none' }} onClick={() => alert(`Detalhes do: ${veiculo.nome}`)}>
                          Ver detalhes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Rodapé */}
      <footer className="text-center py-4" style={{ background: '#111', color: '#FFD600', marginTop: 40, borderTop: '4px solid #FFD600' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          {/* Ícone de cone no rodapé */}
          <svg width="24" height="32" viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="56" width="32" height="8" rx="4" fill="#FFD600" />
            <polygon points="24,4 44,56 4,56" fill="#FFA000" stroke="#FFD600" strokeWidth="2" />
            <rect x="16" y="32" width="16" height="6" fill="#fffde7" rx="2" />
            <rect x="18" y="42" width="12" height="5" fill="#fffde7" rx="2" />
          </svg>
          <span>© {new Date().getFullYear()} AutoCampos. Todos os direitos reservados.</span>
        </div>
      </footer>
    </div>
  );
}

export default Home_geral;
