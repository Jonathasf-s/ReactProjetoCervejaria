import React, { useState, useEffect } from 'react';
import LinhaPedido from '../../components/LinhaPedido';
import { usePedidos } from '../../hooks/usePedidos';
import './Pedidos.css';

export default function Pedidos() {
  // Puxando toda a inteligência do hook
  const {
    pedidos,
    pedidoEmEdicao,
    salvarPedido,
    deletarPedido,
    carregarPedidoParaEdicao,
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

  // Helper para obter preço da cerveja pelo ID
  const getPrecoCerveja = (cervejaId) => {
    const cerveja = cervejas.find(c => c.id === cervejaId);
    return cerveja ? parseFloat(cerveja.preco) : 0;
  };

  // Calcula total de vendas
  const totalVendas = pedidos.reduce((acc, pedido) => {
    const preco = getPrecoCerveja(pedido.cervejaId);
    return acc + (preco * pedido.quantidade);
  }, 0);

  return (
    <div className="container-pedidos">
      <h1>🛒 Gerenciamento de Pedidos</h1>

      <section className="formulario-section">
        <h2>{editando ? '✏️ Editar Pedido' : '🍺 Novo Pedido'}</h2>
        <form onSubmit={handleSalvar}>
          <div className="form-row">
            <div className="form-group">
              <label>Cliente *</label>
              <select 
                name="clienteId"
                value={formData.clienteId} 
                onChange={handleInputChange} 
                required
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

            <div className="form-group">
              <label>Cerveja *</label>
              <select 
                name="cervejaId"
                value={formData.cervejaId} 
                onChange={handleInputChange} 
                required
              >
                <option value="">Selecione uma cerveja...</option>
                {cervejas.length > 0 ? (
                  cervejas.map(cerveja => (
                    <option key={cerveja.id} value={cerveja.id}>
                      {cerveja.nome} - R$ {cerveja.preco}
                    </option>
                  ))
                ) : (
                  <option disabled>Nenhuma cerveja cadastrada</option>
                )}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantidade *</label>
              <input 
                type="number" 
                name="quantidade"
                min="1" 
                value={formData.quantidade} 
                onChange={handleInputChange} 
                required
              />
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="btn-salvar">
              {editando ? '✏️ Atualizar' : '➕ Registrar Pedido'}
            </button>
            {editando && (
              <button type="button" className="btn-cancelar" onClick={cancelarEdicao}>
                ❌ Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="listagem-section">
        <h2>Lista de Pedidos</h2>
        {pedidos.length === 0 ? (
          <p className="sem-dados">Nenhum pedido registrado ainda</p>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="tabela-pedidos">
                <thead>
                  <tr>
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
                  {pedidos.map((pedido) => (
                    <LinhaPedido
                      key={pedido.id}
                      pedido={pedido}
                      clientes={clientes}
                      cervejas={cervejas}
                      onEditar={(p) => carregarPedidoParaEdicao(p.id)}
                      onDeletar={(id) => deletarPedido(id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Resumo de vendas */}
            <div className="resumo-vendas">
              <h3>📊 Resumo de Vendas</h3>
              <div className="resumo-grid">
                <div className="resumo-item">
                  <span className="label">Total de Pedidos:</span>
                  <span className="valor">{pedidos.length}</span>
                </div>
                <div className="resumo-item">
                  <span className="label">Quantidade Total:</span>
                  <span className="valor">{pedidos.reduce((acc, p) => acc + p.quantidade, 0)}</span>
                </div>
                <div className="resumo-item destaque">
                  <span className="label">Faturamento Total:</span>
                  <span className="valor">R$ {totalVendas.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
