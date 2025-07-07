import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

import Login from './components/Login';
import Anuncios from './components/Anuncio';
import Funcionario from './components/Funcionario';
import Home from './components/Home';
import Home_geral from './components/Home_geral';
import UserManagement from './components/UserManagement';
import UserForm from './components/UserForm';
import FuncionarioManagement from './components/FuncionarioManagement';
import FuncionarioForm from './components/FuncionarioForm';
import FuncionarioDashboard from './components/FuncionarioDashboard';
import ClienteManagement from './components/ClienteManagement';
import ClienteForm from './components/ClienteForm';
import CarroManagement from './components/CarroManagement';
import CarroForm from './components/CarroForm';
import MotoManagement from './components/MotoManagement';
import MotoForm from './components/MotoForm';
import VendaManagement from './components/VendaManagement'; // NOVO IMPORT
import VendaForm from './components/VendaForm'; // NOVO IMPORT

function App() {
  const [autenticado, setAutenticado] = useState(false);

  return (
    <Router>
      <div className="App">
        <nav style={navStyles}>
          <ul style={ulStyles}>
            <li style={liStyles}><Link to="/home_geral" style={linkStyles}>Home Geral</Link></li>
            <li style={liStyles}><Link to="/login" style={linkStyles}>Login</Link></li>
            {autenticado && (
              <li style={liStyles}><Link to="/home" style={linkStyles}>Home (Autenticado)</Link></li>
            )}
            {autenticado && (
              <li style={liStyles}><Link to="/usuarios" style={linkStyles}>Gerenciar Usuários</Link></li>
            )}
            {autenticado && (
              <li style={liStyles}><Link to="/funcionarios" style={linkStyles}>Gerenciar Funcionários</Link></li>
            )}
            {autenticado && (
              <li style={liStyles}><Link to="/clientes" style={linkStyles}>Gerenciar Clientes</Link></li>
            )}
            {autenticado && (
              <li style={liStyles}><Link to="/carros" style={linkStyles}>Gerenciar Carros</Link></li>
            )}
            {autenticado && (
              <li style={liStyles}><Link to="/motos" style={linkStyles}>Gerenciar Motos</Link></li>
            )}
            {autenticado && ( // Adicione este link para vendas
              <li style={liStyles}><Link to="/vendas" style={linkStyles}>Gerenciar Vendas</Link></li>
            )}
            {/* Adicione outros links de navegação aqui */}
          </ul>
        </nav>

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

          {/* Rotas para Gerenciamento de Usuários (protegidas por autenticação) */}
          <Route 
            path="/usuarios"
            element={autenticado ? <UserManagement /> : <Navigate to="/login" />}
          />
          <Route 
            path="/usuarios/:mode"
            element={autenticado ? <UserForm /> : <Navigate to="/login" />}
          />
          <Route 
            path="/usuarios/:mode/:id"
            element={autenticado ? <UserForm /> : <Navigate to="/login" />}
          />

          {/* Rotas para Gerenciamento de Funcionários (protegidas por autenticação) */}
          <Route 
            path="/funcionarios"
            element={autenticado ? <FuncionarioManagement /> : <Navigate to="/login" />}
          />
          <Route 
            path="/funcionarios/:mode"
            element={autenticado ? <FuncionarioForm /> : <Navigate to="/login" />}
          />
          <Route 
            path="/funcionarios/:mode/:id"
            element={autenticado ? <FuncionarioForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/funcionarios/dashboard/:id"
            element={autenticado ? <FuncionarioDashboard /> : <Navigate to="/login" />}
          />

          {/* Rotas para Gerenciamento de Clientes (protegidas por autenticação) */}
          <Route 
            path="/clientes"
            element={autenticado ? <ClienteManagement /> : <Navigate to="/login" />}
          />
          <Route 
            path="/clientes/:mode"
            element={autenticado ? <ClienteForm /> : <Navigate to="/login" />}
          />
          <Route 
            path="/clientes/:mode/:id"
            element={autenticado ? <ClienteForm /> : <Navigate to="/login" />}
          />

          {/* Rotas para Gerenciamento de Carros (protegidas por autenticação) */}
          <Route 
            path="/carros"
            element={autenticado ? <CarroManagement /> : <Navigate to="/login" />}
          />
          <Route 
            path="/carros/:mode"
            element={autenticado ? <CarroForm /> : <Navigate to="/login" />}
          />
          <Route 
            path="/carros/:mode/:id"
            element={autenticado ? <CarroForm /> : <Navigate to="/login" />}
          />

          {/* NOVAS ROTAS PARA GERENCIAMENTO DE MOTOS (protegidas por autenticação) */}
          <Route 
            path="/motos"
            element={autenticado ? <MotoManagement /> : <Navigate to="/login" />}
          />
          <Route 
            path="/motos/:mode"
            element={autenticado ? <MotoForm /> : <Navigate to="/login" />}
          />
          <Route 
            path="/motos/:mode/:id"
            element={autenticado ? <MotoForm /> : <Navigate to="/login" />}
          />
          {/* NOVAS ROTAS PARA GERENCIAMENTO DE VENDAS (protegidas por autenticação) */}
          <Route 
            path="/vendas"
            element={autenticado ? <VendaManagement /> : <Navigate to="/login" />}
          />
          <Route 
            path="/vendas/:mode"
            element={autenticado ? <VendaForm /> : <Navigate to="/login" />}
          />
          <Route 
            path="/vendas/:mode/:id"
            element={autenticado ? <VendaForm /> : <Navigate to="/login" />}
          />
          {/* Adicione outras rotas aqui */}
        </Routes>
      </div>
    </Router>
  );
}

// Estilos básicos para a navegação (você pode mover para um CSS file)
const navStyles = {
  backgroundColor: '#333',
  padding: '10px 0',
};

const ulStyles = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  justifyContent: 'center',
};

const liStyles = {
  margin: '0 15px',
};

const linkStyles = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '1.1em',
};

export default App;