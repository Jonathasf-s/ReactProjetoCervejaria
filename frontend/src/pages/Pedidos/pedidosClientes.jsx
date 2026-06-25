import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './pedidosClientes.css';

const PRODUTOS_PADRAO = [
  { id: 'padrao_1', nome: 'IPA Especial',  preco: '18.90', emoji: '🍋', descricao: 'Notas cítricas e amargor equilibrado.' },
  { id: 'padrao_2', nome: 'Weiss Suave',   preco: '14.50', emoji: '🌾', descricao: 'Leve e refrescante, com toque de banana.' },
  { id: 'padrao_3', nome: 'Stout Escura',  preco: '16.00', emoji: '☕', descricao: 'Café e chocolate amargo, corpo cremoso.' },
];

function PedidosClientes({ onConfirmarPedido, onVoltarVitrine }) {
  const { usuarioAtual } = useContext(AuthContext);
  const [cervejas, setCervejas] = useState([]);

  // Carrinho: { [cervejaId]: quantidade }
  const [carrinho, setCarrinho] = useState({});

  useEffect(() => {
    const salvas = JSON.parse(localStorage.getItem('mars_cervejas')) || [];
    setCervejas(salvas.length > 0 ? salvas : PRODUTOS_PADRAO);
  }, []);

  const alterarQuantidade = (id, delta) => {
    setCarrinho((prev) => {
      const atual = prev[id] || 0;
      const nova = Math.max(0, atual + delta);
      if (nova === 0) {
        const { [id]: _, ...resto } = prev;
        return resto;
      }
      return { ...prev, [id]: nova };
    });
  };

  const itensNoCarrinho = Object.entries(carrinho)
    .filter(([, qtd]) => qtd > 0)
    .map(([id, qtd]) => {
      const cerveja = cervejas.find((c) => c.id === id);
      return { ...cerveja, quantidade: qtd, subtotal: (parseFloat(cerveja.preco) * qtd).toFixed(2) };
    });

  const totalGeral = itensNoCarrinho.reduce((acc, item) => acc + parseFloat(item.subtotal), 0);

  const handleConfirmar = () => {
    if (itensNoCarrinho.length === 0) {
      alert('Adicione pelo menos um produto ao pedido.');
      return;
    }

    // Salva o pedido no localStorage (para o admin ver em Pedidos/Relatório)
    const pedidos = JSON.parse(localStorage.getItem('mars_pedidos')) || [];
    const clientes = JSON.parse(localStorage.getItem('mars_clientes')) || [];

    const clienteEncontrado = clientes.find((c) => c.id === usuarioAtual?.id);

    const novosPedidos = itensNoCarrinho.map((item) => ({
      id: `venda_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
      clienteId: usuarioAtual?.id || 'desconhecido',
      cervejaId: item.id,
      quantidade: item.quantidade,
      dataCriacao: new Date().toLocaleDateString('pt-BR'),
    }));

    localStorage.setItem('mars_pedidos', JSON.stringify([...pedidos, ...novosPedidos]));

    // Passa para a tela de resumo
    onConfirmarPedido({
      itens: itensNoCarrinho,
      total: totalGeral.toFixed(2),
      cliente: clienteEncontrado || { nome: usuarioAtual?.nome || 'Cliente' },
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    });
  };

  return (
    <div className="pedido-clientes-container">
      {/* Header */}
      <header className="pedido-header">
        <div className="pedido-header-content">
          <button className="btn-voltar" onClick={onVoltarVitrine}>← Vitrine</button>
          <h1>🍺 Mars Cervejaria</h1>
          <span className="pedido-usuario">Olá, {usuarioAtual?.nome?.split(' ')[0]}!</span>
        </div>
      </header>

      <div className="pedido-layout">
        {/* LISTA DE PRODUTOS */}
        <section className="pedido-produtos">
          <h2>Escolha suas cervejas</h2>

          <div className="pedido-grid">
            {cervejas.map((cerveja) => {
              const qtd = carrinho[cerveja.id] || 0;
              return (
                <div key={cerveja.id} className={`pedido-card ${qtd > 0 ? 'selecionado' : ''}`}>
                  <div className="pedido-card-emoji">{cerveja.emoji || '🍺'}</div>
                  <div className="pedido-card-info">
                    <h3>{cerveja.nome}</h3>
                    {cerveja.descricao && <p className="pedido-card-desc">{cerveja.descricao}</p>}
                    <span className="pedido-card-preco">R$ {parseFloat(cerveja.preco).toFixed(2)}</span>
                  </div>
                  <div className="pedido-card-controles">
                    <button
                      className="btn-qtd menos"
                      onClick={() => alterarQuantidade(cerveja.id, -1)}
                      disabled={qtd === 0}
                    >−</button>
                    <span className="qtd-valor">{qtd}</span>
                    <button
                      className="btn-qtd mais"
                      onClick={() => alterarQuantidade(cerveja.id, +1)}
                    >+</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RESUMO DO CARRINHO */}
        <aside className="pedido-carrinho">
          <h2>Seu pedido</h2>

          {itensNoCarrinho.length === 0 ? (
            <p className="carrinho-vazio">Nenhum item adicionado ainda.</p>
          ) : (
            <ul className="carrinho-lista">
              {itensNoCarrinho.map((item) => (
                <li key={item.id} className="carrinho-item">
                  <span className="carrinho-item-nome">{item.nome} × {item.quantidade}</span>
                  <span className="carrinho-item-valor">R$ {item.subtotal}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="carrinho-total">
            <span>Total</span>
            <span>R$ {totalGeral.toFixed(2)}</span>
          </div>

          <button
            className="btn-confirmar"
            onClick={handleConfirmar}
            disabled={itensNoCarrinho.length === 0}
          >
            Confirmar pedido →
          </button>
        </aside>
      </div>
    </div>
  );
}

export default PedidosClientes;