import React from 'react';

export default function LinhaPedido({ pedido, clientes, cervejas, onEditar, onDeletar }) {
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
    return cerveja ? parseFloat(cerveja.preco) : 0;
  };

  const preco = getPrecoCerveja(pedido.cervejaId);
  const total = (preco * pedido.quantidade).toFixed(2);

  return (
    <tr>
      <td>{pedido.id}</td>
      <td>{getNomeCliente(pedido.clienteId)}</td>
      <td>{getNomeCerveja(pedido.cervejaId)}</td>
      <td>{pedido.quantidade}</td>
      <td>R$ {preco.toFixed(2)}</td>
      <td style={{ fontWeight: 'bold' }}>R$ {total}</td>
      <td>
        <button className="btn-editar" onClick={() => onEditar(pedido)}>
          ✏️ Editar
        </button>
        <button className="btn-deletar" onClick={() => onDeletar(pedido.id)}>
          🗑️ Deletar
        </button>
      </td>
    </tr>
  );
}
