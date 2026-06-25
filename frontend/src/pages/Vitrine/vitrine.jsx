import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './vitrine.css';

const PRODUTOS_PADRAO = [
  { id: 'padrao_1', nome: 'IPA Especial',  preco: '18.90', descricao: 'Uma IPA intensa com notas cítricas e amargor equilibrado. Perfeita para os amantes de cervejas encorpadas.', emoji: '🍋' },
  { id: 'padrao_2', nome: 'Weiss Suave',   preco: '14.50', descricao: 'Cerveja de trigo leve e refrescante, com toque de banana e cravo. Ideal para dias quentes.', emoji: '🌾' },
  { id: 'padrao_3', nome: 'Stout Escura',  preco: '16.00', descricao: 'Cerveja escura com sabores de café e chocolate amargo. Corpo cremoso e final persistente.', emoji: '☕' },
];

function Vitrine({ onIrParaLogin, onIrParaPedido, onIrParaAdmin }) {
  const { logado, usuarioAtual, sair } = useContext(AuthContext);
  const [cervejas, setCervejas] = useState([]);

  useEffect(() => {
    const salvas = JSON.parse(localStorage.getItem('mars_cervejas')) || [];
    if (salvas.length > 0) {
      setCervejas(salvas.map((c) => ({ ...c, emoji: '🍺', descricao: `Cerveja artesanal Mars. Preço: R$ ${c.preco}` })));
    } else {
      setCervejas(PRODUTOS_PADRAO);
    }
  }, []);

  const isCliente = logado && usuarioAtual?.tipo === 'cliente';

  // Desloga E volta para a tela pública da vitrine
  const handleSair = () => {
    sair();
    // Após sair, o App.jsx vai cair no fallback público (vitrine sem login)
    // pois logado passa a ser false — não precisa de redirect manual
  };

  return (
    <div className="vitrine-container">

      {/* HEADER */}
      <header className="vitrine-header">
        <div className="vitrine-header-content">
          <div className="vitrine-logo">
            <span className="vitrine-logo-icon">🍺</span>
            <span className="vitrine-logo-nome">Mars Cervejaria</span>
          </div>

          <nav className="vitrine-nav">
            {isCliente ? (
              <>
                <span className="vitrine-usuario">Olá, {usuarioAtual.nome.split(' ')[0]}!</span>
                <button className="btn-nav-pedido" onClick={onIrParaPedido}>
                  🛒 Fazer Pedido
                </button>
                <button className="btn-nav-sair" onClick={handleSair}>
                  Sair
                </button>
              </>
            ) : (
              <button className="btn-nav-login" onClick={onIrParaLogin}>
                Entrar / Cadastrar
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="vitrine-hero">
        <div className="vitrine-hero-content">
          <h1 className="vitrine-hero-titulo">
            Cervejas artesanais<br />
            <span className="destaque">feitas com paixão</span>
          </h1>
          <p className="vitrine-hero-subtitulo">
            Cada garrafa conta uma história. Escolha a sua favorita e peça agora mesmo.
          </p>
          {isCliente ? (
            <button className="btn-hero" onClick={onIrParaPedido}>
              🛒 Ver cardápio e pedir
            </button>
          ) : (
            <button className="btn-hero" onClick={onIrParaLogin}>
              Entrar e pedir agora
            </button>
          )}
        </div>

        <div className="vitrine-hero-decoracao">
          <span className="hero-emoji-grande">🍻</span>
        </div>
      </section>

      {/* PRODUTOS */}
      <section className="vitrine-produtos">
        <div className="vitrine-produtos-header">
          <h2>Nossos produtos</h2>
          <p>Escolha entre nossas cervejas cuidadosamente elaboradas</p>
        </div>

        <div className="vitrine-grid">
          {cervejas.map((cerveja) => (
            <div key={cerveja.id} className="vitrine-card">
              <div className="card-emoji">{cerveja.emoji || '🍺'}</div>
              <div className="card-info">
                <h3 className="card-nome">{cerveja.nome}</h3>
                <p className="card-descricao">{cerveja.descricao}</p>
                <div className="card-rodape">
                  <span className="card-preco">R$ {cerveja.preco}</span>
                  <button
                    className="btn-card-pedir"
                    onClick={isCliente ? onIrParaPedido : onIrParaLogin}
                  >
                    {isCliente ? 'Pedir' : 'Entrar para pedir'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CHAMADA FINAL (só para não logados) */}
      {!isCliente && (
        <section className="vitrine-cta">
          <div className="cta-box">
            <h2>Pronto para pedir?</h2>
            <p>Crie sua conta gratuitamente e faça seu primeiro pedido em minutos.</p>
            <button className="btn-cta" onClick={onIrParaLogin}>
              Criar conta e pedir
            </button>
          </div>
        </section>
      )}

      {/* FOOTER com link discreto para admin */}
      <footer className="vitrine-footer">
        <p>© {new Date().getFullYear()} Mars Cervejaria — Todos os direitos reservados.</p>
        <button className="btn-acesso-admin" onClick={onIrParaAdmin}>
          Acesso Administrativo
        </button>
      </footer>

    </div>
  );
}

export default Vitrine;