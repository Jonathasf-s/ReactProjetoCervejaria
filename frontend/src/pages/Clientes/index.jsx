import React, { useState, useEffect } from 'react';
import LinhaCliente from '../../components/LinhaCliente';
import './Clientes.css';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    endereco: '',
    dataNascimento: ''
  });
  const [editando, setEditando] = useState(false);

  // Carregar clientes do localStorage ao montar
  useEffect(() => {
    const clientesSalvos = localStorage.getItem('mars_clientes');
    if (clientesSalvos) {
      setClientes(JSON.parse(clientesSalvos));
    }
  }, []);

  // Validar campos obrigatórios
  const validarFormulario = () => {
    if (!formData.nome.trim() || !formData.email.trim() || !formData.telefone.trim() || !formData.cpf.trim() || !formData.endereco.trim() || !formData.dataNascimento) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return false;
    }
    return true;
  };

  // Validar CPF (formato básico)
  const validarCPF = (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    return cpfLimpo.length === 11;
  };

  // Resetar formulário
  const resetarFormulario = () => {
    setFormData({
      id: '',
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      endereco: '',
      dataNascimento: ''
    });
    setEditando(false);
  };

  // Atualizar campo do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Callback para editar cliente
  const handleEditar = (cliente) => {
    setFormData(cliente);
    setEditando(true);
  };

  return (
    <div className="container-clientes">
      <h1>📋 Cadastro de Clientes</h1>

      {/* Formulário */}
      <section className="formulario-section">
        <h2>{editando ? 'Editar Cliente' : 'Novo Cliente'}</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (!validarFormulario()) return;

          if (!validarCPF(formData.cpf)) {
            alert('CPF deve conter 11 dígitos');
            return;
          }

          if (editando) {
            // Membro 5 vai implementar a lógica de edição e persistência
            console.log('Membro 5: Implementar atualização do cliente', formData);
          } else {
            // Membro 5 vai implementar a lógica de criação e persistência
            console.log('Membro 5: Implementar criação do cliente', formData);
          }
          resetarFormulario();
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
              <button type="button" className="btn-cancelar" onClick={resetarFormulario}>
                ❌ Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Lista de Clientes */}
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
                  onEditar={handleEditar}
                  onDeletar={(id) => {
                    // Membro 5 vai implementar a lógica de deleção
                    console.log('Membro 5: Implementar deleção do cliente', id);
                  }}
                />
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
