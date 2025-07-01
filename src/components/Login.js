import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({setAutenticado}) {
  // Estados para armazenar email e senha digitados
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  // Função chamada ao enviar o formulário
  function handleSubmit(event) {
    event.preventDefault(); // Evita recarregar a página
    setAutenticado(true);
    // Aqui você pode validar login se quiser (exemplo: if(email === ... && senha === ...))
    navigate('/home'); // Redireciona para a Home
  }

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: "100%" }}>
        <h2 className="mb-4 text-center">AutoCampos - Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">E-mail</label>
            <input 
              type="email"
              className="form-control"
              id="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="senha" className="form-label">Senha</label>
            <input 
              type="password"
              className="form-control"
              id="senha"
              placeholder="Digite sua senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;