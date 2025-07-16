import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HomeAdmin() {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const [stats, setStats] = useState(null);
  const [grafico, setGrafico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/admins/dashboard`);
        if (!response.ok) throw new Error(`HTTP status ${response.status}`);
        const data = await response.json();
        setStats(data.metricas);
        setGrafico(data.grafico);
      } catch (e) {
        console.error('Erro ao buscar dashboard admin:', e);
        setError('Falha ao carregar dashboard.');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Carregando dashboard do administrador...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;

  return (
    <>
      <nav className='navbar mb-4' style={{ background: '#555', padding: '1rem' }}>
        <span style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>Painel do Administrador</span>
      </nav>
      <main className='container'>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <div style={{ flex: 1, minWidth: 200, padding: 20, background: '#fffde7', border: '2px solid #FFD600', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontWeight: 600 }}>Carros Vendidos</div>
            <div style={{ fontSize: 32 }}>{stats.total_carros_vendidos}</div>
          </div>
          <div style={{ flex: 1, minWidth: 200, padding: 20, background: '#fffde7', border: '2px solid #FFD600', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontWeight: 600 }}>Valor Carros (R$)</div>
            <div style={{ fontSize: 24 }}>{stats.valor_carros.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
          </div>
          <div style={{ flex: 1, minWidth: 200, padding: 20, background: '#fffde7', border: '2px solid #FFD600', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontWeight: 600 }}>Motos Vendidas</div>
            <div style={{ fontSize: 32 }}>{stats.total_motos_vendidas}</div>
          </div>
          <div style={{ flex: 1, minWidth: 200, padding: 20, background: '#fffde7', border: '2px solid #FFD600', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontWeight: 600 }}>Valor Motos (R$)</div>
            <div style={{ fontSize: 24 }}>{stats.valor_motos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
          </div>
        </div>

        {grafico && (
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img src={grafico} alt="Gráfico Vendas Carros vs Motos" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}

        <h3>Funcionários: Salário e Comissão</h3>
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Salário (R$)</th>
              <th>Comissão (R$)</th>
            </tr>
          </thead>
          <tbody>
            {stats.funcionarios.map(f => (
              <tr key={f.funcionario_id}>
                <td>{f.funcionario_id}</td>
                <td>{f.nome}</td>
                <td>{f.salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>{f.comissao_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}

export default HomeAdmin;
