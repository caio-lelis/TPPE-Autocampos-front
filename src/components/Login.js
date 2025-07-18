// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function Login({setAutenticado}) {
//   // Estados para armazenar email e senha digitados
//   const [email, setEmail] = useState('');
//   const [senha, setSenha] = useState('');
//   const navigate = useNavigate();

//   // Função chamada ao enviar o formulário
//   function handleSubmit(event) {
//     event.preventDefault(); // Evita recarregar a página
//     setAutenticado(true);
//     // Aqui você pode validar login se quiser (exemplo: if(email === ... && senha === ...))
//     navigate('/home'); // Redireciona para a Home
//   }

//   return (
//     <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
//       <div className="card p-4 shadow" style={{ maxWidth: 400, width: "100%" }}>
//         <h2 className="mb-4 text-center">AutoCampos - Login</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="email" className="form-label">E-mail</label>
//             <input 
//               type="email"
//               className="form-control"
//               id="email"
//               placeholder="Digite seu e-mail"
//               value={email}
//               onChange={e => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="senha" className="form-label">Senha</label>
//             <input 
//               type="password"
//               className="form-control"
//               id="senha"
//               placeholder="Digite sua senha"
//               value={senha}
//               onChange={e => setSenha(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" className="btn btn-primary w-100">Entrar</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setAutenticado, setUserType }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();  // Define navigate para redirecionamento

  async function handleSubmit(event) {
    event.preventDefault();
    setLoginError(null);
    // Define base URL e endpoint de login conforme tipo de usuário
    const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const endpoint = isAdmin ? '/admins/login' : '/funcionarios/login';
    try {
      const response = await fetch(`${baseURL}/api/v1${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      if (!response.ok) {
        const data = await response.json();
        setLoginError(data.detail || 'Email ou senha inválidos.');
        return;
      }
      const user = await response.json();
      setAutenticado(true);
      // Define o tipo de usuário (admin ou funcionario)
      setUserType(user.tipo);
      // Armazena o papel do usuário para o Header
      localStorage.setItem('userRole', user.tipo);
      // Aqui você pode salvar user no contexto/global/localStorage se quiser
      navigate('/home');
    } catch (e) {
      setLoginError('Erro ao conectar com o servidor.');
    }
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFD600 0%, #FFC107 100%)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        className="card shadow"
        style={{
          maxWidth: 420,
          width: '100%',
          borderRadius: 15,
          padding: '2rem',
          boxShadow: '0 8px 16px rgba(0,0,0,0.25)',
          background: '#fffde7',
          border: '2px solid #FFD600',
        }}
      >
        <div className="text-center mb-4">
          {/* Logo AutoCampos */}
          <img src="/logo.png" alt="AutoCampos Logo" style={{ maxHeight: 70, maxWidth: '80%', objectFit: 'contain', marginBottom: 2 }} />
          <p style={{ color: '#111', fontSize: 14, marginTop: 0, fontWeight: 600, marginBottom: 0 }}>
            Funcionários e Administradores
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {loginError && <div style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{loginError}</div>}
          <div className="mb-3">
            <label
              htmlFor="email"
              className="form-label"
              style={{ fontWeight: '600', color: '#111' }}
            >
              E-mail
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ borderRadius: 8, padding: '0.75rem 1rem', border: '2px solid #111', background: '#fffde7', color: '#111' }}
            />
          </div>
          <div className="mb-3 d-flex align-items-center gap-2">
            <label htmlFor="isAdmin" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: 0, gap: 4 }}>
              <span style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, marginRight: 4 }}>
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={isAdmin}
                  onChange={e => setIsAdmin(e.target.checked)}
                  style={{ opacity: 0, width: 44, height: 24, margin: 0, position: 'absolute', left: 0, top: 0, cursor: 'pointer' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: isAdmin ? 'linear-gradient(90deg, #FFD600 60%, #FFC107 100%)' : '#ddd',
                    transition: 'background 0.2s',
                    boxShadow: isAdmin ? '0 2px 8px 0 #FFD60044' : '0 1px 4px 0 #bbb2',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    top: 3,
                    left: isAdmin ? 24 : 3,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: isAdmin ? '#111' : '#fff',
                    boxShadow: '0 1px 4px 0 #bbb2',
                    transition: 'left 0.2s, background 0.2s',
                    border: isAdmin ? '2px solid #FFD600' : '2px solid #bbb',
                  }}
                ></span>
              </span>
              <span style={{ fontWeight: 700, color: '#111', fontSize: 15, letterSpacing: 0.2 }}>
                Sou administrador
              </span>
            </label>
          </div>
          <div className="mb-4">
            <label
              htmlFor="senha"
              className="form-label"
              style={{ fontWeight: '600', color: '#111' }}
            >
              Senha
            </label>
            <input
              type="password"
              className="form-control"
              id="senha"
              placeholder="********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={{ borderRadius: 8, padding: '0.75rem 1rem', border: '2px solid #111', background: '#fffde7', color: '#111' }}
            />
          </div>
          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: '#111',
              color: '#FFD600',
              fontWeight: '700',
              borderRadius: 8,
              padding: '0.75rem',
              width: '100%',
              letterSpacing: 1,
              border: 'none',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#FFD600')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#111')}
            onMouseOver={(e) => (e.target.style.color = '#111')}
            onMouseOut={(e) => (e.target.style.color = '#FFD600')}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;