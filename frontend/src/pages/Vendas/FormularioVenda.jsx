import React, { useState, useEffect } from 'react';
import { usePedidos } from '../../hooks/usePedidos';

function FormularioVenda() {
  // Puxando toda a inteligência do hook
  const {
    pedidoEmEdicao,
    salvarPedido,
    cancelarEdicao
  } = usePedidos();

  // Estados para carregar as opções disponíveis
  const [clientes, setClientes] = useState([]);
  const [cervejas, setCervejas] = useState([]);

  // Estado local para controlar a digitação no formulário
  const [formData, setFormData] = useState({
    id: '',
    clienteId: '',
    cervejaId: '',
    quantidade: 1
  });

  // Sempre que o hook avisar que há um pedido em edição, o formulário é preenchido
  useEffect(() => {
    if (pedidoEmEdicao) {
      setFormData(pedidoEmEdicao);
    } else {
      // Limpa os inputs se cancelar a edição ou após salvar com sucesso
      setFormData({
        id: '',
        clienteId: '',
        cervejaId: '',
        quantidade: 1
      });
    }
  }, [pedidoEmEdicao]);

  // Carrega dados E escuta mudanças no localStorage
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

  const editando = !!pedidoEmEdicao;

  const validarFormulario = () => {
    if (!formData.clienteId || !formData.cervejaId || formData.quantidade <= 0) {
      alert('Por favor, preencha todos os campos corretamente');
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantidade' ? Number(value) : value
    });
  };

  const handleSalvar = (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    // Valida se cliente e cerveja existem
    const clienteExiste = clientes.find(c => c.id === formData.clienteId);
    const cervejaExiste = cervejas.find(c => c.id === formData.cervejaId);

    if (!clienteExiste || !cervejaExiste) {
      alert("❌ Cliente ou cerveja não encontrado(a)!");
      return;
    }

    // Chama a função do hook para salvar
    salvarPedido(formData);

    if (!editando) {
      alert("Venda registrada com sucesso!");
    } else {
      alert("Venda atualizada com sucesso!");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>{editando ? '✏️ Editar Venda' : '🍺 Registrar Nova Venda'}</h2>
      
      <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Cliente: </label>
          <select 
            name="clienteId"
            value={formData.clienteId} 
            onChange={handleInputChange} 
            required 
            style={{ width: '100%', padding: '8px' }}
          >
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
          <select 
            name="cervejaId"
            value={formData.cervejaId} 
            onChange={handleInputChange} 
            required 
            style={{ width: '100%', padding: '8px' }}
          >
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
            name="quantidade"
            min="1" 
            value={formData.quantidade} 
            onChange={handleInputChange} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit" 
            style={{ 
              flex: 1,
              padding: '10px', 
              backgroundColor: '#d35400', 
              color: 'white', 
              border: 'none', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              borderRadius: '4px'
            }}
          >
            {editando ? '✏️ Atualizar' : '➕ Salvar Venda'}
          </button>
          {editando && (
            <button 
              type="button" 
              onClick={cancelarEdicao}
              style={{ 
                flex: 1,
                padding: '10px', 
                backgroundColor: '#95a5a6', 
                color: 'white', 
                border: 'none', 
                cursor: 'pointer', 
                fontWeight: 'bold',
                borderRadius: '4px'
              }}
            >
              ❌ Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Debug info */}
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px', fontSize: '12px' }}>
        <p>📊 Clientes disponíveis: {clientes.length}</p>
        <p>🍻 Cervejas disponíveis: {cervejas.length}</p>
        {editando && <p>✏️ Modo de edição ativo</p>}
      </div>
    </div>
  );
}

export default FormularioVenda;
