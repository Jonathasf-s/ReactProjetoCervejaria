import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { entrar } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault(); // Impede a página de recarregar
    
    // Executa a função de entrar da nossa central
    const sucesso = entrar(email, senha);
    if (sucesso) {
      alert("Login realizado com sucesso!");
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Mars Cervejaria - Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>E-mail: *</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required // Validação de campo obrigatório
          />
        </div>
        <br />
        <div>
          <label>Senha: *</label>
          <input 
            type="password" 
            value={senha} 
            onChange={(e) => setSenha(e.target.value)} 
            required // Validação de campo obrigatório
          />
        </div>
        <br />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;