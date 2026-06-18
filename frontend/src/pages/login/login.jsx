import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { entrar } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    
    const sucesso = entrar(email, senha);
    if (sucesso) {
      alert("Login realizado com sucesso!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>🍻 Mars Cervejaria</h1>
          <p>Sistema Administrativo</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input 
              id="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
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
              onChange={(e) => setSenha(e.target.value)} 
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button type="submit" className="btn-entrar">
            Entrar
          </button>
        </form>

        <div className="login-footer">
          <p>Credenciais de teste:</p>
          <p>E-mail: <strong>admin@mars.com</strong></p>
          <p>Senha: <strong>123456</strong></p>
        </div>
      </div>

      <div className="login-background"></div>
    </div>
  );
}

export default Login;
