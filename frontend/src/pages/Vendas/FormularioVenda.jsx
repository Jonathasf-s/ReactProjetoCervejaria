import React, { useState, useEffect } from 'react';

function FormularioVenda() {
  // Estados para carregar as opções disponíveis
  const [clientes, setClientes] = useState([]);
  const [cervejas, setCervejas] = useState([]);

  // Estados dos campos do formulário
  const [clienteId, setClienteId] = useState('');
  const [cervejaId, setCervejaId] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  // Carrega clientes e cervejas quando a tela abre
  useEffect(() => {
    const clientesSalvos = JSON.parse(localStorage.getItem('mars_clientes')) || [];
    const cervejasSalvas = JSON.parse(localStorage.getItem('mars_cervejas')) || [];
    setClientes(clientesSalvos);
    setCervejas(cervejasSalvas);
  }, []);

  const handleSalvar = (e) => {
    e.preventDefault();

    if (!clienteId || !cervejaId || quantidade <= 0) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    // Monta o objeto do novo pedido
    const novoPedido = {
      id: Date.now().toString(), // Gera um ID único baseado no tempo
      clienteId: clienteId,
      cervejaId: cervejaId,
      quantidade: Number(quantidade)
    };

    // Puxa os pedidos antigos, adiciona o novo e salva novamente
    const pedidosExistentes = JSON.parse(localStorage.getItem('mars_pedidos')) || [];
    pedidosExistentes.push(novoPedido);
    localStorage.setItem('mars_pedidos', JSON.stringify(pedidosExistentes));

    alert("Venda registrada com sucesso!");
    
    // Limpa o formulário após salvar
    setClienteId('');
    setCervejaId('');
    setQuantidade(1);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>🍺 Registrar Nova Venda</h2>
      
      <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Cliente: </label>
          <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
            <option value="">Selecione um cliente...</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Cerveja: </label>
          <select value={cervejaId} onChange={(e) => setCervejaId(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
            <option value="">Selecione a cerveja...</option>
            {cervejas.map(cerveja => (
              <option key={cerveja.id} value={cerveja.id}>{cerveja.nome} - R$ {cerveja.preco}</option>
            ))}
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
    </div>
  );
}

export default FormularioVenda;