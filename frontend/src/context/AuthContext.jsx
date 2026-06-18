import React, { createContext, useState, useEffect } from 'react';

// Criamos a central de informações de autenticação
export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [logado, setLogado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // verifica se já existia um login salvo no navegador
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('mars_cervejaria_login');
    if (usuarioSalvo) {
      setLogado(true);
    }
    setCarregando(false);
  }, []);

  // simular o Login (validação temporária com credenciais de teste)
  function entrar(email, senha) {
    if (!email || !senha) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return false;
    }

    // Credenciais de teste (substituir por verificação com backend no futuro)
    const credencialEmail = 'admin@mars.com';
    const credencialSenha = '123456';

    if (email.toLowerCase() === credencialEmail && senha === credencialSenha) {
      localStorage.setItem('mars_cervejaria_login', 'true');
      setLogado(true);
      return true;
    } else {
      alert('Credenciais inválidas. Use admin@mars.com / 123456');
      return false;
    }
  }

  function sair() {
    localStorage.removeItem('mars_cervejaria_login');
    setLogado(false);
  }

  if (carregando) return <div>Carregando sistema...</div>;

  return (
    <AuthContext.Provider value={{ logado, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}