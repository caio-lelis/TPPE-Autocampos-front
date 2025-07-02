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

function Login({ setAutenticado }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    setAutenticado(true);
    navigate('/home');
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
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
        }}
      >
        <div className="text-center mb-4">
          {/* Logo ou ícone de carro */}
          <img
            src="https://img.icons8.com/ios-filled/64/2a5298/car.png"
            alt="Marketplace de Concessionária"
            style={{ marginBottom: 16 }}
          />
          <h2 style={{ color: '#2a5298', fontWeight: '700', letterSpacing: 1 }}>
            AutoCampos
          </h2>
          <p style={{ color: '#555', fontSize: 14, marginTop: 4 }}>
            Funcionarios e Administradores
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="email"
              className="form-label"
              style={{ fontWeight: '600', color: '#2a5298' }}
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
              style={{ borderRadius: 8, padding: '0.75rem 1rem' }}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="senha"
              className="form-label"
              style={{ fontWeight: '600', color: '#2a5298' }}
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
              style={{ borderRadius: 8, padding: '0.75rem 1rem' }}
            />
          </div>
          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: '#2a5298',
              color: 'white',
              fontWeight: '700',
              borderRadius: 8,
              padding: '0.75rem',
              width: '100%',
              letterSpacing: 1,
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#1e3c72')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#2a5298')}
          >
            Entrar
          </button>
        </form>
        <p
          className="text-center mt-3"
          style={{ fontSize: 13, color: '#777' }}
        >
          Não tem uma conta?{' '}
          <a href="/register" style={{ color: '#2a5298', fontWeight: '600' }}>
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;