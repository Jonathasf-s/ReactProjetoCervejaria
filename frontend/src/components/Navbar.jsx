import React from 'react';
import './Navbar.css';
import logoSvg from '/src/assets/logos/logobranca.svg';

export default function Navbar({ telaAtiva, setTelaAtiva, onLogout }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo e Nome da Empresa */}
        <div className="navbar-brand">
          <img src={logoSvg} alt="Mars Cervejaria Logo" className="navbar-logo" />
          <span className="navbar-title">Mars Cervejaria - Admin</span>
        </div>

        {/* Menu de Navegação */}
        <nav className="navbar-menu">
          <button 
            className={`navbar-btn ${telaAtiva === 'formulario' ? 'active' : ''}`}
            onClick={() => setTelaAtiva('formulario')}
          >
            📝 Cervejas
          </button>

          <button 
            className={`navbar-btn ${telaAtiva === 'clientes' ? 'active' : ''}`}
            onClick={() => setTelaAtiva('clientes')}
          >
            👥 Clientes
          </button>

          <button 
            className={`navbar-btn ${telaAtiva === 'pedidos' ? 'active' : ''}`}
            onClick={() => setTelaAtiva('pedidos')}
          >
            🛒 Pedidos
          </button>

          <button 
            className={`navbar-btn ${telaAtiva === 'relatorio' ? 'active' : ''}`}
            onClick={() => setTelaAtiva('relatorio')}
          >
            📊 Relatório
          </button>
        </nav>

        {/* Botão de Logout */}
        <button className="navbar-logout" onClick={onLogout}>
          🚪 Sair
        </button>
      </div>
    </header>
  );
}
