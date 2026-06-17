import React, { useState, useEffect } from 'react';

// ✅ GERADOR CENTRALIZADO - Mesmo formato que useClientes
function gerarId() {
  return `venda_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
}

function FormularioVenda() {
  // Estados para carregar as opções disponíveis
  const [clientes, setClientes] = useState([]);
  const [cervejas, setCervejas] = useState([]);

  // Estados dos campos do formulário
  const [clienteId, setClienteId] = useState('');
  const [cervejaId, setCervejaId] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  // ✅ Carrega dados E escuta mudanças no localStorage
  useEffect(() => {
    carregarDados();
    
    // Escuta mudanças quando outro formulário atualiza os dados
    const handleStorageChange = () => {
      carregarDados();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const carregarDados = () => {
    try {
      const clientesSalvos = JSON.parse(localStorage.getItem('mars_clientes')) || [];
      const cervejasSalvas = JSON.parse(localStorage.getItem('mars_cervejas')) || [];
      setClientes(clientesSalvos);
      setCervejas(cervejasSalvas);
    } catch (erro) {
      console.error('❌ Erro ao carregar dados:', erro);
    }
  };

  const handleSalvar = (e) => {
    e.preventDefault();

    if (!clienteId || !cervejaId || quantidade <= 0) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    // ✅ Valida se cliente e cerveja existem
    const clienteExiste = clientes.find(c => c.id === clienteId);
    const cervejaExiste = cervejas.find(c => c.id === cervejaId);

    if (!clienteExiste || !cervejaExiste) {
      alert("❌ Cliente ou cerveja não encontrado(a)!");
      return;
    }

    // Monta o objeto do novo pedido
    const novoPedido = {
      id: gerarId(), // ✅ Mesmo formato padronizado
      clienteId: clienteId,
      cervejaId: cervejaId,
      quantidade: Number(quantidade)
    };

    try {
      // Puxa os pedidos antigos, adiciona o novo e salva novamente
      const pedidosExistentes = JSON.parse(localStorage.getItem('mars_pedidos')) || [];
      pedidosExistentes.push(novoPedido);
      localStorage.setItem('mars_pedidos', JSON.stringify(pedidosExistentes));

      alert("Venda registrada com sucesso!");
      
      // Limpa o formulário após salvar
      setClienteId('');
      setCervejaId('');
      setQuantidade(1);
    } catch (erro) {
      console.error('❌ Erro ao salvar pedido:', erro);
      alert("Erro ao salvar a venda!");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>🍺 Registrar Nova Venda</h2>
      
      <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Cliente: </label>
          <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
            <option value="">Selecione um cliente...</option>
            {clientes.length > 0 ? (
              clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
              ))
            ) : (
              <option disabled>Nenhum cliente cadastrado</option>
            )}
          </select>
        </div>

        <div>
          <label>Cerveja: </label>
          <select value={cervejaId} onChange={(e) => setCervejaId(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
            <option value="">Selecione a cerveja...</option>
            {cervejas.length > 0 ? (
              cervejas.map(cerveja => (
                <option key={cerveja.id} value={cerveja.id}>{cerveja.nome} - R$ {cerveja.preco}</option>
              ))
            ) : (
              <option disabled>Nenhuma cerveja cadastrada</option>
            )}
          </select>
        </div>

        <div>
          <label>Quantidade: </label>
          <input 
            type="number" 
            min="1" 
            value={quantidade} 
            onChange={(e) => setQuantidade(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#d35400', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          Salvar Venda
        </button>
      </form>

      {/* ✅ Debug info */}
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px', fontSize: '12px' }}>
        <p>📊 Clientes disponíveis: {clientes.length}</p>
        <p>🍻 Cervejas disponíveis: {cervejas.length}</p>
      </div>
    </div>
  );
}

export default FormularioVenda;
