import React from 'react';

export default function LinhaCliente({ cliente, onEditar, onDeletar }) {
  return (
    <tr>
      <td>{cliente.id}</td>
      <td>{cliente.nome}</td>
      <td>{cliente.cpf}</td>
      <td>{new Date(cliente.dataNascimento).toLocaleDateString('pt-BR')}</td>
      <td>
        <button className="btn-editar" onClick={() => onEditar(cliente)}>
          Editar
        </button>
        <button className="btn-deletar" onClick={() => onDeletar(cliente.id)}>
          Deletar
        </button>
      </td>
    </tr>
  );
}
