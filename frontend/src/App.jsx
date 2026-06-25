import React, { useContext, useState } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Páginas Admin
import Login from './pages/login/login';
import Formulario from './pages/Formulario/Formulario';
import Relatorio from './pages/Relatorio/Relatorio';
import Clientes from './pages/Clientes/index';
import Pedidos from './pages/Pedidos/index';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas novas (clientes)
import Vitrine from './pages/Vitrine/vitrine';
import LoginClientes from './pages/login/loginClientes';
import CadastroClientes from './pages/Clientes/cadastroClientes';
import PedidosClientes from './pages/Pedidos/pedidosClientes';
import RelatorioClientes from './pages/Relatorio/relatorioClientes';

function ConteudoDoSistema() {
  const { logado, usuarioAtual, sair } = useContext(AuthContext);

  const [tela, setTela] = useState('vitrine');
  const [pedidoParaResumo, setPedidoParaResumo] = useState(null);

  // ── ADMIN ──────────────────────────────────────────────
  if (logado && usuarioAtual?.tipo === 'admin') {
    const telaAdmin = ['formulario', 'clientes', 'pedidos', 'relatorio'].includes(tela)
      ? tela : 'formulario';

    return (
      <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column' }}>
        <Navbar
          telaAtiva={telaAdmin}
          setTelaAtiva={setTela}
          onLogout={() => { sair(); setTela('vitrine'); }}
        />
        <main style={{ padding: '30px', flex: 1 }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            {telaAdmin === 'formulario' && <Formulario />}
            {telaAdmin === 'clientes'   && <Clientes />}
            {telaAdmin === 'pedidos'    && <Pedidos />}
            {telaAdmin === 'relatorio'  && <Relatorio />}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── LOGIN ADMIN ─────────────────────────────────────────
  if (tela === 'loginAdmin') {
    return <Login onVoltarVitrine={() => setTela('vitrine')} />;
  }

  // ── CLIENTE LOGADO ──────────────────────────────────────
  if (logado && usuarioAtual?.tipo === 'cliente') {

    if (tela === 'relatorioClientes' && pedidoParaResumo) {
      return (
        <RelatorioClientes
          pedido={pedidoParaResumo}
          onVoltar={() => {
            setPedidoParaResumo(null);
            setTela('pedidosClientes');
          }}
          onVoltarVitrine={() => {
            setPedidoParaResumo(null);
            setTela('vitrine');
          }}
        />
      );
    }

    if (tela === 'pedidosClientes') {
      return (
        <PedidosClientes
          onConfirmarPedido={(pedido) => {
            setPedidoParaResumo(pedido);
            setTela('relatorioClientes');
          }}
          onVoltarVitrine={() => setTela('vitrine')}
        />
      );
    }

    // tela === 'vitrine' ou qualquer outro valor → mostra vitrine logada
    return (
      <Vitrine
        onIrParaLogin={() => setTela('loginClientes')}
        onIrParaPedido={() => setTela('pedidosClientes')}
        onIrParaAdmin={() => setTela('loginAdmin')}
      />
    );
  }

  // ── PÚBLICO NÃO LOGADO ──────────────────────────────────
  if (tela === 'cadastroClientes') {
    return (
      <CadastroClientes
        onIrParaLogin={() => setTela('loginClientes')}
      />
    );
  }

  if (tela === 'loginClientes') {
    return (
      <LoginClientes
        onIrParaCadastro={() => setTela('cadastroClientes')}
        onIrParaVitrine={() => setTela('vitrine')}
      />
    );
  }

  // Vitrine pública (padrão / fallback)
  return (
    <Vitrine
      onIrParaLogin={() => setTela('loginClientes')}
      onIrParaPedido={() => setTela('loginClientes')}
      onIrParaAdmin={() => setTela('loginAdmin')}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <ConteudoDoSistema />
    </AuthProvider>
  );
}

export default App;