import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Anuncios from './components/Anuncio';
import Funcionario from './components/Funcionario';
import Home from './components/Home';

function App() {
  const [autenticado, setAutenticado] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setAutenticado={setAutenticado} />} />
        <Route path="/anuncios" element={<Anuncios />} />
        <Route path="/funcionario" element={<Funcionario />} />
        {/* Protege a rota /home */}
        <Route 
          path="/home"
          element={autenticado ? <Home /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;