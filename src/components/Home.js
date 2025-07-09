import React from 'react';
import { useNavigate } from 'react-router-dom';
// Ícones SVG simples para os cards
const icons = {
  clientes: (
    <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><circle cx="8" cy="8" r="4" fill="#FFD600" stroke="#111" strokeWidth="1.5"/><circle cx="16" cy="8" r="4" fill="#FFD600" stroke="#111" strokeWidth="1.5"/><rect x="2" y="16" width="8" height="6" rx="3" fill="#fffde7" stroke="#111" strokeWidth="1.5"/><rect x="14" y="16" width="8" height="6" rx="3" fill="#fffde7" stroke="#111" strokeWidth="1.5"/></svg>
  ),
  carros: (
    <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><rect x="3" y="12" width="18" height="6" rx="2" fill="#FFD600" stroke="#111" strokeWidth="1.5"/><circle cx="7" cy="19" r="2" fill="#111"/><circle cx="17" cy="19" r="2" fill="#111"/></svg>
  ),
  motos: (
    <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><circle cx="7" cy="17" r="3" fill="#FFD600" stroke="#111" strokeWidth="1.5"/><circle cx="17" cy="17" r="3" fill="#FFD600" stroke="#111" strokeWidth="1.5"/><rect x="10" y="14" width="4" height="2" fill="#111"/><rect x="11" y="10" width="2" height="4" fill="#111"/></svg>
  ),
  vendas: (
    <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#FFD600" stroke="#111" strokeWidth="1.5"/><path d="M8 16l3-4 2 2 3-4" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8" cy="16" r="1.5" fill="#111"/><circle cx="13" cy="14" r="1.5" fill="#111"/><circle cx="16" cy="10" r="1.5" fill="#111"/></svg>
  ),
};

// Mock de dados de vendas e comissão
const vendasFuncionario = 12;
const totalVendas = 120000; // em reais
const comissao = totalVendas * 0.05; // 5% de comissão

function Home() {
  const navigate = useNavigate();
  return (
    <>
      {/* Barra superior simples */}
      <nav className='navbar mb-5' style={{ background: '#8c8c8c', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', minHeight: 64 }}>
        <div className='container-fluid position-relative d-flex align-items-center' style={{ minHeight: 64 }}>
          {/* Logo à esquerda */}
          <img src="/logo.png" alt="AutoCampos Logo" style={{ height: 48, marginRight: 12, position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)' }} />
          {/* Texto centralizado */}
          <span className='w-100 text-center' style={{ fontSize: 24, fontWeight: 700, color: '#222' }}>
            Painel do Funcionário
          </span>
        </div>
      </nav>

      {/* Dashboard resumo */}
      <main className='container'>
        <div className='row mb-4 g-3'>
          <div className='col-md-4'>
            <div className='card shadow-sm p-4 text-center h-100' style={{ borderRadius: 16, background: '#fffde7', border: '2px solid #FFD600' }}>
              <div style={{ fontSize: 18, color: '#111', fontWeight: 700 }}>Vendas Realizadas</div>
              <div style={{ fontSize: 36, color: '#111', fontWeight: 800 }}>{vendasFuncionario}</div>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='card shadow-sm p-4 text-center h-100' style={{ borderRadius: 16, background: '#fffde7', border: '2px solid #FFD600' }}>
              <div style={{ fontSize: 18, color: '#111', fontWeight: 700 }}>Total em Vendas</div>
              <div style={{ fontSize: 28, color: '#111', fontWeight: 800 }}>{totalVendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='card shadow-sm p-4 text-center h-100' style={{ borderRadius: 16, background: '#FFD600', border: '2px solid #111' }}>
              <div style={{ fontSize: 18, color: '#111', fontWeight: 700 }}>Comissão Recebida</div>
              <div style={{ fontSize: 28, color: '#111', fontWeight: 800 }}>{comissao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            </div>
          </div>
        </div>

        {/* Cards de gerenciamento */}
        <section className='row mt-2 g-4'>
          <article className='col-md-3 col-sm-6'>
            <div className='card h-100 text-center shadow-sm p-4' style={{ borderRadius: 16, border: '2px solid #FFD600', background: '#fffde7', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
              <div style={{ marginBottom: 10 }}>{icons.clientes}</div>
              <div style={{ fontWeight: 700, color: '#111', fontSize: 18 }}>Gerenciar Clientes</div>
              <button className='btn btn-outline-secondary btn-sm mt-3' onClick={() => navigate('/clientes')}>Acessar</button>
            </div>
          </article>
          <article className='col-md-3 col-sm-6'>
            <div className='card h-100 text-center shadow-sm p-4' style={{ borderRadius: 16, border: '2px solid #FFD600', background: '#fffde7', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
              <div style={{ marginBottom: 10 }}>{icons.carros}</div>
              <div style={{ fontWeight: 700, color: '#111', fontSize: 18 }}>Gerenciar Carros</div>
              <button className='btn btn-outline-secondary btn-sm mt-3' onClick={() => navigate('/carros')}>Acessar</button>
            </div>
          </article>
          <article className='col-md-3 col-sm-6'>
            <div className='card h-100 text-center shadow-sm p-4' style={{ borderRadius: 16, border: '2px solid #FFD600', background: '#fffde7', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
              <div style={{ marginBottom: 10 }}>{icons.motos}</div>
              <div style={{ fontWeight: 700, color: '#111', fontSize: 18 }}>Gerenciar Motos</div>
              <button className='btn btn-outline-secondary btn-sm mt-3' onClick={() => navigate('/motos')}>Acessar</button>
            </div>
          </article>
          <article className='col-md-3 col-sm-6'>
            <div className='card h-100 text-center shadow-sm p-4' style={{ borderRadius: 16, border: '2px solid #FFD600', background: '#fffde7', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
              <div style={{ marginBottom: 10 }}>{icons.vendas}</div>
              <div style={{ fontWeight: 700, color: '#111', fontSize: 18 }}>Gerenciar Vendas</div>
              <button className='btn btn-outline-secondary btn-sm mt-3' onClick={() => navigate('/vendas')}>Acessar</button>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}

export default Home;
