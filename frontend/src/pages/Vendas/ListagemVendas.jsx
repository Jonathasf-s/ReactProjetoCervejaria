import React, { useState, useEffect } from 'react';

function ListagemVendas() {
  const [pedidos, setPedidos] = useState([]);

  // Carrega os pedidos assim que o componente é montado
  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = () => {
    const pedidosSalvos = JSON.parse(localStorage.getItem('mars_pedidos')) || [];
    setPedidos(pedidosSalvos);
  };

  const handleDeletar = (id) => {
    // Pede confirmação antes de apagar
    const confirmacao = window.confirm("Tem certeza que deseja cancelar e excluir esta venda?");
    
    if (confirmacao) {
      // Filtra a lista, removendo o pedido com o ID selecionado
      const novaLista = pedidos.filter((pedido) => pedido.id !== id);
      
      // Salva a nova lista no banco local e atualiza a tela
      localStorage.setItem('mars_pedidos', JSON.stringify(novaLista));
      setPedidos(novaLista);
      alert("Venda excluída com sucesso.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 Gerenciamento de Vendas</h2>
      
      {pedidos.length === 0 ? (
        <p>Nenhuma venda registrada.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#333', color: '#fff' }}>
              <th>ID do Pedido</th>
              <th>ID Cliente</th>
              <th>ID Cerveja</th>
              <th>Qtd</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{pedido.clienteId}</td>
                <td>{pedido.cervejaId}</td>
                <td>{pedido.quantidade}</td>
                <td>
                  <button 
                    onClick={() => handleDeletar(pedido.id)}
                    style={{ padding: '5px 10px', backgroundColor: '#c0392b', color: 'white', border: 'none', cursor: 'pointer' }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ListagemVendas;