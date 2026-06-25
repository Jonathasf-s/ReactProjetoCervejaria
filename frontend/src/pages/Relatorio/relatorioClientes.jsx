import React, { useEffect, useRef } from 'react';
import './relatorioClientes.css';

// Gerador simples de código de barras EAN-like em SVG puro (sem biblioteca)
function CodigoDeBarras({ valor }) {
  // Converte o valor em barras alternadas estreitas/largas para efeito visual
  const barras = [];
  const seed = valor.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const totalBarras = 60;

  for (let i = 0; i < totalBarras; i++) {
    // Padrão pseudoaleatório baseado no valor do pedido para ser único
    const ehEscura = ((seed * (i + 1) * 37) % 3) !== 0;
    const largura = ((seed * i * 13) % 3) === 0 ? 4 : 2;
    barras.push({ escura: ehEscura, largura });
  }

  return (
    <div className="barcode-container">
      <svg
        viewBox="0 0 200 80"
        xmlns="http://www.w3.org/2000/svg"
        className="barcode-svg"
      >
        {/* Barras */}
        {(() => {
          let x = 10;
          return barras.map((barra, i) => {
            const rect = (
              <rect
                key={i}
                x={x}
                y={10}
                width={barra.largura}
                height={55}
                fill={barra.escura ? '#1a0a00' : 'white'}
              />
            );
            x += barra.largura + 0.5;
            return rect;
          });
        })()}
        {/* Número abaixo */}
        <text
          x="100"
          y="75"
          textAnchor="middle"
          fontSize="7"
          fontFamily="monospace"
          fill="#333"
        >
          {valor}
        </text>
      </svg>
    </div>
  );
}

function RelatorioClientes({ pedido, onVoltar, onVoltarVitrine }) {
  if (!pedido) return null;

  const { itens, total, cliente, data, hora } = pedido;

  // Gera código de pagamento fictício único baseado no timestamp
  const codigoPagamento = `MARS${Date.now().toString().slice(-10)}`;
  const codigoBarrasNumerico = `789${Date.now().toString().slice(-9)}${Math.floor(Math.random() * 10)}`;

  return (
    <div className="resumo-container">
      <div className="resumo-box">

        {/* Cabeçalho */}
        <div className="resumo-header">
          <div className="resumo-check">✅</div>
          <h1>Pedido confirmado!</h1>
          <p>Obrigado, <strong>{cliente.nome}</strong>! Seu pedido foi registrado com sucesso.</p>
        </div>

        {/* Dados do pedido */}
        <div className="resumo-meta">
          <div className="meta-item">
            <span className="meta-label">Data</span>
            <span className="meta-valor">{data}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Hora</span>
            <span className="meta-valor">{hora}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Código</span>
            <span className="meta-valor codigo">{codigoPagamento}</span>
          </div>
        </div>

        {/* Itens do pedido */}
        <div className="resumo-itens">
          <h2>Itens do pedido</h2>
          <table className="resumo-tabela">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Qtd.</th>
                <th>Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="item-emoji">{item.emoji || '🍺'}</span>
                    {item.nome}
                  </td>
                  <td>{item.quantidade}×</td>
                  <td>R$ {parseFloat(item.preco).toFixed(2)}</td>
                  <td className="subtotal">R$ {item.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="resumo-total-linha">
            <span>Total a pagar</span>
            <span className="resumo-total-valor">R$ {total}</span>
          </div>
        </div>

        {/* Seção de pagamento com código de barras */}
        <div className="resumo-pagamento">
          <h2>💳 Pagamento</h2>
          <p className="pagamento-instrucao">
            Escaneie o código de barras ou copie o código de pagamento abaixo:
          </p>

          <CodigoDeBarras valor={codigoBarrasNumerico} />

          <div className="codigo-copia">
            <span className="codigo-texto">{codigoBarrasNumerico}</span>
            <button
              className="btn-copiar"
              onClick={() => {
                navigator.clipboard.writeText(codigoBarrasNumerico);
                alert('Código copiado!');
              }}
            >
              Copiar
            </button>
          </div>

          <p className="pagamento-aviso">
            ⚠️ Este é um ambiente de demonstração. Nenhuma cobrança real será realizada.
          </p>
        </div>

        {/* Ações */}
        <div className="resumo-acoes">
          <button className="btn-novo-pedido" onClick={onVoltar}>
            🍺 Fazer outro pedido
          </button>
          <button className="btn-voltar-vitrine" onClick={onVoltarVitrine}>
            ← Voltar à vitrine
          </button>
        </div>

      </div>
    </div>
  );
}

export default RelatorioClientes;