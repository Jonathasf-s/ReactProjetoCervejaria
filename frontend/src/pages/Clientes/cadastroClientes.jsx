import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './cadastroClientes.css';

function CadastroClientes({ onIrParaLogin }) {
  const { cadastrarCliente } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    cpf: '',
    endereco: '',
    dataNascimento: '',
  });

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErro('');
  };

  const handleCadastrar = (e) => {
    e.preventDefault();
    setErro('');

    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    if (formData.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const cpfLimpo = formData.cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      setErro('CPF inválido. Digite os 11 dígitos.');
      return;
    }

    const { confirmarSenha, ...dadosParaSalvar } = formData;
    const resultado = cadastrarCliente(dadosParaSalvar);

    if (resultado) {
      setSucesso(true);
    }
  };

  if (sucesso) {
    return (
      <div className="cadastro-container">
        <div className="cadastro-box sucesso-box">
          <div className="sucesso-icon">🎉</div>
          <h2>Cadastro realizado!</h2>
          <p>Bem-vindo(a) à Mars Cervejaria, <strong>{formData.nome}</strong>!</p>
          <p>Agora você pode fazer login e aproveitar nossos produtos.</p>
          <button className="btn-ir-login" onClick={onIrParaLogin}>
            Ir para o Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cadastro-container">
      <div className="cadastro-box">
        <div className="cadastro-header">
          <h1>🍺 Mars Cervejaria</h1>
          <h2>Criar conta</h2>
          <p>Junte-se a nós e peça suas cervejas favoritas!</p>
        </div>

        {erro && <div className="cadastro-erro">{erro}</div>}

        <form onSubmit={handleCadastrar} className="cadastro-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nome completo *</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Seu nome"
                required
              />
            </div>

            <div className="form-group">
              <label>E-mail *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Senha *</label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirmar senha *</label>
              <input
                type="password"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                placeholder="Repita a senha"
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
                onChange={handleChange}
                placeholder="000.000.000-00"
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
                onChange={handleChange}
                placeholder="(00) 00000-0000"
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
              onChange={handleChange}
              placeholder="Rua, número, bairro, cidade"
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Data de nascimento *</label>
            <input
              type="date"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-cadastrar">
            Criar minha conta
          </button>
        </form>

        <div className="cadastro-footer">
          <p>Já tem uma conta?{' '}
            <button className="link-btn" onClick={onIrParaLogin}>
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CadastroClientes;