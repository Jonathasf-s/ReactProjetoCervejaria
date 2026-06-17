import React, { useState, useEffect } from 'react';

function Relatorio() {
  const [relatorioDados, setRelatorioDados] = useState([]);
  const [totalVendas, setTotalVendas] = useState(0);

  // ✅ Função que carrega e processa os dados
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

      // ✅ JOIN corrigido - compara IDs diretamente (sem String())
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

  // ✅ Carrega ao montar e escuta mudanças no localStorage
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
    <div style={{ padding: '20px' }}>
      <h2>📊 Relatório de Vendas — Mars Cervejaria</h2>
      <p></p>

      {relatorioDados.length === 0 ? (
        <p>Nenhum pedido realizado até o momento.</p>
      ) : (
        <>
          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#222', color: '#fff' }}>
                <th>ID Pedido</th>
                <th>Cliente</th>
                <th>Cerveja</th>
                <th>Quantidade</th>
                <th>Valor Unit. (R$)</th>
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
                  <td>R$ {item.valorUnitario}</td>
                  <td style={{ fontWeight: 'bold' }}>R$ {item.valorTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ Total de vendas */}
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '4px', border: '2px solid #4caf50' }}>
            <h3 style={{ margin: 0, color: '#2e7d32' }}>
              💰 Total de Vendas: R$ {totalVendas.toFixed(2)}
            </h3>
          </div>
        </>
      )}
    </div>
  );
}

export default Relatorio;
