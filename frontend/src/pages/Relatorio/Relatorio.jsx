import React, { useState, useEffect } from 'react';
import './Relatorio.css';

function Relatorio() {
  const [relatorioDados, setRelatorioDados] = useState([]);
  const [totalVendas, setTotalVendas] = useState(0);

  // Função que carrega e processa os dados
  const carregarRelatorio = () => {
    try {
      const pedidos = JSON.parse(localStorage.getItem('mars_pedidos')) || [];
      const clientes = JSON.parse(localStorage.getItem('mars_clientes')) || [];
      const cervejas = JSON.parse(localStorage.getItem('mars_cervejas')) || [];

      if (pedidos.length === 0) {
        setRelatorioDados([]);
        setTotalVendas(0);
        return;
      }

      // JOIN corrigido - compara IDs diretamente (sem String())
      const dadosCruzados = pedidos.map((pedido) => {
        // Procura o cliente usando o ID correto
        const clienteEncontrado = clientes.find(c => c.id === pedido.clienteId);
        
        // Procura a cerveja usando o ID correto
        const cervejaEncontrada = cervejas.find(cerv => cerv.id === pedido.cervejaId);

        // Calcula o valor
        const precoCerveja = cervejaEncontrada ? Number(cervejaEncontrada.preco) : 0;
        const valorTotalItem = precoCerveja * Number(pedido.quantidade);

        return {
          id: pedido.id,
          nomeCliente: clienteEncontrado ? clienteEncontrado.nome : '❌ Cliente não encontrado',
          nomeCerveja: cervejaEncontrada ? cervejaEncontrada.nome : '❌ Cerveja não encontrada',
          quantidade: pedido.quantidade,
          valorUnitario: precoCerveja.toFixed(2),
          valorTotal: valorTotalItem.toFixed(2)
        };
      });

      // Calcula total de vendas
      const total = dadosCruzados.reduce((sum, item) => sum + Number(item.valorTotal), 0);

      setRelatorioDados(dadosCruzados);
      setTotalVendas(total);
    } catch (erro) {
      console.error('❌ Erro ao carregar relatório:', erro);
      setRelatorioDados([]);
      setTotalVendas(0);
    }
  };

  // Carrega ao montar e escuta mudanças no localStorage
  useEffect(() => {
    carregarRelatorio();

    // Escuta eventos de armazenamento
    const handleStorageChange = () => {
      carregarRelatorio();
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="container-relatorio">
      <h1>📊 Relatório de Vendas</h1>

      <section className="relatorio-section">
        {relatorioDados.length === 0 ? (
          <p className="sem-dados">Nenhum pedido realizado até o momento.</p>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="tabela-relatorio">
                <thead>
                  <tr>
                    <th>ID Pedido</th>
                    <th>Cliente</th>
                    <th>Cerveja</th>
                    <th>Quantidade</th>
                    <th>Valor Unit. (R$)</th>
                    <th>Total (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorioDados.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.nomeCliente}</td>
                      <td>{item.nomeCerveja}</td>
                      <td>{item.quantidade}x</td>
                      <td>R$ {item.valorUnitario}</td>
                      <td className="valor-total">R$ {item.valorTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Resumo Total */}
            <div className="resumo-relatorio">
              <div className="resumo-item destaque">
                <span className="label">💰 Total de Vendas:</span>
                <span className="valor">R$ {totalVendas.toFixed(2)}</span>
              </div>
              <div className="resumo-item">
                <span className="label">📦 Pedidos Realizados:</span>
                <span className="valor">{relatorioDados.length}</span>
              </div>
              <div className="resumo-item">
                <span className="label">🍻 Quantidade Total:</span>
                <span className="valor">{relatorioDados.reduce((acc, item) => acc + item.quantidade, 0)}</span>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Relatorio;
