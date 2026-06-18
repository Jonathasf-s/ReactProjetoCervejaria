import React, { useContext, useState } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login/Login';
import Formulario from './pages/Formulario/Formulario';
import Relatorio from './pages/Relatorio/Relatorio';
import Clientes from './pages/Clientes';
import Pedidos from './pages/Pedidos';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function ConteudoDoSistema() {
  const { logado, sair } = useContext(AuthContext);
  
  // Estado que controla qual tela está ativa na tela do usuário
  const [telaAtiva, setTelaAtiva] = useState('formulario');

  // 🔒 BLOQUEIO DAS TELAS: Se não estiver logado, obriga a ficar na tela de Login
  if (!logado) {
    return <Login />;
  }

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      minHeight: '100vh', 
      backgroundColor: '#f9f9f9',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* NAVBAR COMPONENT */}
      <Navbar 
        telaAtiva={telaAtiva} 
        setTelaAtiva={setTelaAtiva}
        onLogout={sair}
      />
      
      {/* 🖥️ RENDERIZAÇÃO CONDICIONAL DA TELA */}
      <main style={{ padding: '30px', flex: 1 }}>
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

        {telaAtiva === 'pedidos' && (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <Pedidos />
          </div>
        )}
        
        {telaAtiva === 'relatorio' && (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <Relatorio />
          </div>
        )}
      </main>

      {/* FOOTER COMPONENT */}
      <Footer />
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
