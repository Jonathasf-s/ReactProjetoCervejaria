import React, { useContext, useState } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login/Login';
import Formulario from './pages/Formulario/Formulario';
import Relatorio from './pages/Relatorio/Relatorio'; // Importando seu relatório com JOIN
import Clientes from './pages/Clientes'; // Importar página de Clientes

function ConteudoDoSistema() {
  const { logado, sair } = useContext(AuthContext);
  
  // Estado que controla qual tela está ativa na tela do usuário
  const [telaAtiva, setTelaAtiva] = useState('formulario');

  // 🔒 BLOQUEIO DAS TELAS: Se não estiver logado, obriga a ficar na tela de Login
  if (!logado) {
    return <Login />;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      
      {/* 🧭 BARRA DE NAVEGAÇÃO SUPERIOR */}
      <header style={{ 
        padding: '15px 30px', 
        background: '#1a1a1a', 
        color: '#fff', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>🍻 Mars Cervejaria - Admin</span>
        
        {/* Menu de Botões para alternar entre as telas */}
        <nav style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => setTelaAtiva('formulario')} 
            style={{ 
              padding: '8px 16px', 
              background: telaAtiva === 'formulario' ? '#ff9900' : '#333', 
              color: telaAtiva === 'formulario' ? '#000' : '#fff', 
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            📝 Formulário (CRUD)
          </button>

          <button 
            onClick={() => setTelaAtiva('clientes')} 
            style={{ 
              padding: '8px 16px', 
              background: telaAtiva === 'clientes' ? '#ff9900' : '#333', 
              color: telaAtiva === 'clientes' ? '#000' : '#fff', 
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            👥 Clientes
          </button>
          
          <button 
            onClick={() => setTelaAtiva('relatorio')} 
            style={{ 
              padding: '8px 16px', 
              background: telaAtiva === 'relatorio' ? '#ff9900' : '#333', 
              color: telaAtiva === 'relatorio' ? '#000' : '#fff', 
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            📊 Relatório (JOIN)
          </button>
        </nav>

        {/* Botão de Logout Funcional */}
        <button 
          onClick={sair} 
          style={{ 
            background: '#d9534f', 
            color: 'white', 
            border: 'none', 
            padding: '8px 16px', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Sair (Logout)
        </button>
      </header>
      
      {/* 🖥️ RENDERIZAÇÃO CONDICIONAL DA TELA */}
      <main style={{ padding: '30px' }}>
        {telaAtiva === 'formulario' && (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <Formulario />
          </div>
        )}

        {telaAtiva === 'clientes' && (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <Clientes />
          </div>
        )}
        
        {telaAtiva === 'relatorio' && (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <Relatorio />
          </div>
        )}
      </main>
    </div>
  );
}

// O App principal envolve todo o sistema com a nossa central de autenticação
function App() {
  return (
    <AuthProvider>
      <ConteudoDoSistema />
    </AuthProvider>
  );
}

export default App;
