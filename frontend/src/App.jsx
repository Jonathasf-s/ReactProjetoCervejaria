import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login/Login';
import Formulario from './pages/Formulario/Formulario';

function ConteudoDoSistema() {
  const { logado, sair } = useContext(AuthContext);

  // 🔒 BLOQUEIO DAS TELAS: Se não estiver logado, obriga a ver a tela de Login
  if (!logado) {
    return <Login />;
  }

  // Se estiver logado, mostra o CRUD e o botão de Logout
  return (
    <div>
      <header style={{ padding: '10px', background: '#222', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
        <span>Mars Cervejaria - Painel Administrativo</span>
        <button onClick={sair} style={{ background: 'red', color: 'white' }}>Sair (Logout)</button>
      </header>
      
      <main>
        {/* Sua tela de CRUD/Formulário protegida */}
        <Formulario />
      </main>
    </div>
  );
}

// O App precisa estar envolvido pelo AuthProvider para a central funcionar
function App() {
  return (
    <AuthProvider>
      <ConteudoDoSistema />
    </AuthProvider>
  );
}

export default App;