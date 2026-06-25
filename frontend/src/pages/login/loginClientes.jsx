import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './loginClientes.css';

function LoginClientes({ onIrParaCadastro, onIrParaVitrine }) {
  const { entrarComoCliente } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setErro('');

    const sucesso = entrarComoCliente(email, senha);
    if (!sucesso) {
      setErro('E-mail ou senha inválidos. Verifique seus dados e tente novamente.');
    }
  };

  return (
    <div className="login-clientes-container">
      <div className="login-clientes-box">
        <div className="login-clientes-header">
          <h1>🍺 Mars Cervejaria</h1>
          <h2>Entrar na sua conta</h2>
          <p>Acesse para fazer seus pedidos</p>
        </div>

        {erro && <div className="login-clientes-erro">{erro}</div>}

        <form onSubmit={handleLogin} className="login-clientes-form">
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErro(''); }}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => { setSenha(e.target.value); setErro(''); }}
              placeholder="Sua senha"
              required
            />
          </div>

          <button type="submit" className="btn-entrar-cliente">
            Entrar
          </button>
        </form>

        <div className="login-clientes-footer">
          <p>
            Não tem conta ainda?{' '}
            <button className="link-btn" onClick={onIrParaCadastro}>
              Criar conta grátis
            </button>
          </p>
          <hr className="separador" />
          <p>
            <button className="link-btn-secundario" onClick={onIrParaVitrine}>
              ← Voltar à vitrine sem login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginClientes;