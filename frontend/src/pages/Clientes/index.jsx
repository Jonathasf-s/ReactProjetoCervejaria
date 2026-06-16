import React, { useState, useEffect } from 'react';
import LinhaCliente from '../../components/LinhaCliente';
import { useClientes } from '../../hooks/useClientes';
import './Clientes.css';

export default function Clientes() {
  // Puxando toda a inteligência do seu Hook
  const {
    clientes,
    clienteEmEdicao,
    salvarCliente,
    deletarCliente,
    carregarClienteParaEdicao,
    cancelarEdicao
  } = useClientes();

  // Estado local para controlar a digitação no formulário
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    endereco: '',
    dataNascimento: ''
  });

  // Sempre que o hook avisar que há um cliente em edição, o formulário é preenchido
  useEffect(() => {
    if (clienteEmEdicao) {
      setFormData(clienteEmEdicao);
    } else {
      // Limpa os inputs se cancelar a edição ou após salvar com sucesso
      setFormData({
        id: '',
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        endereco: '',
        dataNascimento: ''
      });
    }
  }, [clienteEmEdicao]);

  const editando = !!clienteEmEdicao;

  const validarFormulario = () => {
    if (!formData.nome.trim() || !formData.email.trim() || !formData.telefone.trim() || !formData.cpf.trim() || !formData.endereco.trim() || !formData.dataNascimento) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return false;
    }
    return true;
  };

  const validarCPF = (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    return cpfLimpo.length === 11;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="container-clientes">
      <h1>📋 Cadastro de Clientes</h1>

      <section className="formulario-section">
        <h2>{editando ? 'Editar Cliente' : 'Novo Cliente'}</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (!validarFormulario()) return;

          if (!validarCPF(formData.cpf)) {
            alert('CPF deve conter 11 dígitos');
            return;
          }

          // Chama a função do seu Hook para salvar!
          salvarCliente(formData);
        }}>
          <div className="form-row">
            <div className="form-group">
              <label>Nome *</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Digite o nome do cliente"
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Digite o email do cliente"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>CPF *</label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                placeholder="Digite o CPF (11 dígitos)"
                maxLength="14"
                required
              />
            </div>

            <div className="form-group">
              <label>Telefone *</label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                placeholder="Digite o telefone do cliente"
                required
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Endereço *</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleInputChange}
              placeholder="Digite o endereço completo"
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Data de Nascimento *</label>
            <input
              type="date"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="btn-salvar">
              {editando ? '✏️ Atualizar' : '➕ Adicionar'}
            </button>
            {editando && (
              // Chama a função de cancelar edição do seu Hook
              <button type="button" className="btn-cancelar" onClick={cancelarEdicao}>
                ❌ Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="listagem-section">
        <h2>Lista de Clientes</h2>
        {clientes.length === 0 ? (
          <p className="sem-dados">Nenhum cliente cadastrado ainda</p>
        ) : (
          <table className="tabela-clientes">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Data Nascimento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <LinhaCliente
                  key={cliente.id}
                  cliente={cliente}
                  // Conectando os botões da tabela nas suas funções
                  onEditar={(c) => carregarClienteParaEdicao(c.id)}
                  onDeletar={(id) => deletarCliente(id)}
                />
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}