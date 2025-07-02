import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Anuncios from './components/Anuncio';
import Funcionario from './components/Funcionario';
import Home from './components/Home';
import Home_geral from './components/Home_geral';

function App() {
  const [autenticado, setAutenticado] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Redireciona a raiz para /home_geral */}
        <Route path="/" element={<Navigate to="/home_geral" />} />

        {/* Página inicial pública */}
        <Route path="/home_geral" element={<Home_geral />} />

        {/* Página de login */}
        <Route path="/login" element={<Login setAutenticado={setAutenticado} />} />

        {/* Rotas protegidas */}
        <Route 
          path="/home"
          element={autenticado ? <Home /> : <Navigate to="/login" />}
        />
        <Route 
          path="/anuncios" 
          element={autenticado ? <Anuncios /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/funcionario" 
          element={autenticado ? <Funcionario /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
