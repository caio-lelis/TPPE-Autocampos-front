import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Anuncios from './Anuncio';

function Home_geral() {
  console.log('Render Home_geral');
  const navigate = useNavigate();
  // Estados para calculadora de financiamento
  const [valor, setValor] = useState('');
  const [entrada, setEntrada] = useState('');
  const [prazo, setPrazo] = useState('');
  const [juros, setJuros] = useState('');
  const [parcela, setParcela] = useState(null);
  const calcularParcela = () => {
    const V = parseFloat(valor) || 0;
    const E = parseFloat(entrada) || 0;
    const n = parseInt(prazo) || 0;
    const i = (parseFloat(juros) || 0) / 100 / 12;
    if (n > 0 && (V - E) > 0) {
      const P = (V - E) * i / (1 - Math.pow(1 + i, -n));
      setParcela(P.toFixed(2));
    } else {
      setParcela(null);
    }
  };

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
          {/* Logo centralizada */}
          <div className="w-100 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 120 }}>
            <img src="/logo.png" alt="AutoCampos Logo" style={{ maxHeight: 110, maxWidth: '90%', objectFit: 'contain', marginBottom: 8 }} />
            <p className="w-100 text-center" style={{ fontSize: 20, fontWeight: 400, marginBottom: 0 }}>Sua loja de carros e motos seminovos</p>
          </div>
        </div>
      </div>

      {/* Seção principal com anúncios reais */}
      <Anuncios />

      {/* Seção de Serviços */}
      <section className="container py-5">
        <h2 className="mb-4 text-center">Nossos Serviços</h2>
        <div className="row g-4">
          <div className="col-md-4 text-center">
            <h5>Financiamento</h5>
            <p>Opções de financiamento facilitado e personalizado para você.</p>
          </div>
          <div className="col-md-4 text-center">
            <h5>Garantia Estendida</h5>
            <p>Proteção extra para seu seminovo, garantindo tranquilidade.</p>
          </div>
          <div className="col-md-4 text-center">
            <h5>Revisão Completa</h5>
            <p>Revisão detalhada com peças originais e mão de obra especializada.</p>
          </div>
        </div>
      </section>

      {/* Calculadora de Financiamento */}
      <section className="container py-5">
        <h2 className="mb-4 text-center">Calculadora de Financiamento</h2>
        <div className="row g-3 justify-content-center">
          <div className="col-md-3">
            <input type="number" className="form-control" placeholder="Valor do veículo" value={valor} onChange={e => setValor(e.target.value)} />
          </div>
          <div className="col-md-3">
            <input type="number" className="form-control" placeholder="Entrada" value={entrada} onChange={e => setEntrada(e.target.value)} />
          </div>
          <div className="col-md-2">
            <input type="number" className="form-control" placeholder="Prazo (meses)" value={prazo} onChange={e => setPrazo(e.target.value)} />
          </div>
          <div className="col-md-2">
            <input type="number" className="form-control" placeholder="Juros % a.a." value={juros} onChange={e => setJuros(e.target.value)} />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={calcularParcela}>Calcular</button>
          </div>
        </div>
        {parcela && (
          <p className="mt-3 text-center fs-5">Parcela mensal: <strong>R$ {parseFloat(parcela).toLocaleString('pt-BR')}</strong></p>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center py-4" style={{ background: '#111', color: '#FFD600', marginTop: 40, borderTop: '4px solid #FFD600' }}>
        <div className="container">
          <p className="mb-0">&copy; 2024 AutoCampos. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home_geral;
