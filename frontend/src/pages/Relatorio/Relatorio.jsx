import React, { useState, useEffect } from 'react';

function Relatorio() {
  const [relatorioDados, setRelatorioDados] = useState([]);

  useEffect(() => {
    // Le os itens do localStorege
    const pedidos = JSON.parse(localStorage.getItem('mars_pedidos')) || [];
    const clientes = JSON.parse(localStorage.getItem('mars_clientes')) || [];
    const cervejas = JSON.parse(localStorage.getItem('mars_cervejas')) || [];

    // usando o comando .find() ele procura os itens 
    const dadosCruzados = pedidos.map((pedido) => {
      // procura quem fez o pedido
      const clienteEncontrado = clientes.find(c => String(c.id) === String(pedido.clienteId));
      
      // Procura o produto comprado
      const cervejaEncontrada = cervejas.find(cerv => String(cerv.id) === String(pedido.cervejaId));

      //Calcula o valor e quantidade do pedido
      const precoCerveja = cervejaEncontrada ? Number(cervejaEncontrada.preco) : 0;
      const valorTotalItem = precoCerveja * Number(pedido.quantidade);

      // Faz o Join
      return {
        id: pedido.id,
        nomeCliente: clienteEncontrado ? clienteEncontrado.nome : 'Cliente não encontrado',
        nomeCerveja: cervejaEncontrada ? cervejaEncontrada.nome : 'Cerveja não encontrada',
        quantidade: pedido.quantidade,
        valorTotal: valorTotalItem.toFixed(2)
      };
    });

    // Arualiza o STATUS
    setRelatorioDados(dadosCruzados);
  }, []); 

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 Relatório de Vendas — Mars Cervejaria</h2>
      <p>Este relatório realiza um <strong>JOIN simulado</strong> cruzando as tabelas de Pedidos, Clientes e Cervejas.</p>

      {relatorioDados.length === 0 ? (
        <p>Nenhum pedido realizado até o momento.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#222', color: '#fff' }}>
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Cerveja</th>
              <th>Quantidade</th>
              <th>Total da Venda (R$)</th>
            </tr>
          </thead>
          <tbody>
            {relatorioDados.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.nomeCliente}</td>
                <td>{item.nomeCerveja}</td>
                <td>{item.quantidade}x</td>
                <td>R$ {item.valorTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Relatorio;