import React, { useState, useEffect } from 'react';
import { usePedidos } from '../../hooks/usePedidos';

function ListagemVendas() {
  // Puxando toda a inteligência do hook
  const {
    pedidos,
    deletarPedido,
    carregarPedidoParaEdicao
  } = usePedidos();

  // Estados para exibir os nomes de cliente e cerveja
  const [clientes, setClientes] = useState([]);
  const [cervejas, setCervejas] = useState([]);

  // Carrega os dados de clientes e cervejas
  useEffect(() => {
    const clientesSalvos = JSON.parse(localStorage.getItem('mars_clientes')) || [];
    const cervejasSalvas = JSON.parse(localStorage.getItem('mars_cervejas')) || [];
    setClientes(clientesSalvos);
    setCervejas(cervejasSalvas);
  }, []);

  // Helper para obter nome do cliente pelo ID
  const getNomeCliente = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };

  // Helper para obter nome da cerveja pelo ID
  const getNomeCerveja = (cervejaId) => {
    const cerveja = cervejas.find(c => c.id === cervejaId);
    return cerveja ? cerveja.nome : 'Cerveja não encontrada';
  };

  // Helper para obter preço da cerveja pelo ID
  const getPrecoCerveja = (cervejaId) => {
    const cerveja = cervejas.find(c => c.id === cervejaId);
    return cerveja ? cerveja.preco : '0.00';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 Gerenciamento de Vendas</h2>
      
      {pedidos.length === 0 ? (
        <p>Nenhuma venda registrada.</p>
      ) : (
        <table 
          border="1" 
          cellPadding="10" 
          style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            marginTop: '20px', 
            textAlign: 'left',
            minWidth: '1000px'
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#333', color: '#fff' }}>
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Cerveja</th>
              <th>Quantidade</th>
              <th>Valor Unit.</th>
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => {
              const precoCerveja = parseFloat(getPrecoCerveja(pedido.cervejaId));
              const total = (precoCerveja * pedido.quantidade).toFixed(2);
              
              return (
                <tr key={pedido.id}>
                  <td>{pedido.id}</td>
                  <td>{getNomeCliente(pedido.clienteId)}</td>
                  <td>{getNomeCerveja(pedido.cervejaId)}</td>
                  <td>{pedido.quantidade}</td>
                  <td>R$ {precoCerveja.toFixed(2)}</td>
                  <td style={{ fontWeight: 'bold' }}>R$ {total}</td>
                  <td>
                    <button 
                      onClick={() => carregarPedidoParaEdicao(pedido.id)}
                      style={{ 
                        marginRight: '8px',
                        padding: '5px 10px', 
                        backgroundColor: '#28a745', 
                        color: 'white', 
                        border: 'none', 
                        cursor: 'pointer',
                        borderRadius: '3px',
                        fontSize: '12px'
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => deletarPedido(pedido.id)}
                      style={{ 
                        padding: '5px 10px', 
                        backgroundColor: '#c0392b', 
                        color: 'white', 
                        border: 'none', 
                        cursor: 'pointer',
                        borderRadius: '3px',
                        fontSize: '12px'
                      }}
                    >
                      🗑️ Excluir
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Resumo de vendas */}
      {pedidos.length > 0 && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <h3>📊 Resumo de Vendas</h3>
          <p>Total de pedidos: {pedidos.length}</p>
          <p>
            Valor total: R$ {
              pedidos.reduce((acc, pedido) => {
                const preco = parseFloat(getPrecoCerveja(pedido.cervejaId)) || 0;
                return acc + (preco * pedido.quantidade);
              }, 0).toFixed(2)
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default ListagemVendas;
