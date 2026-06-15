import React, { useState } from 'react';

function Formulario() {
  // Criando os estados para guardar o que o usuário digita
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');

  // Função que roda ao enviar o formulário
  const handleCadastrar = (e) => {
    e.preventDefault(); // Impede a página de recarregar

    // Validação lógica extra (garante que não passe nada em branco ou zerado)
    if (!nome.trim() || !preco || Number(preco) <= 0) {
      alert("Por favor, preencha um nome válido e um preço maior que zero.");
      return;
    }

    // Cria o objeto da nova cerveja
    const novaCerveja = {
      id: Date.now().toString(), // Gera um ID único baseado na hora atual
      nome: nome,
      preco: Number(preco).toFixed(2) // Garante o formato de dinheiro (ex: 15.50)
    };

    // Puxa a lista de cervejas do banco local, adiciona a nova e salva novamente
    const cervejasSalvas = JSON.parse(localStorage.getItem('mars_cervejas')) || [];
    cervejasSalvas.push(novaCerveja);
    localStorage.setItem('mars_cervejas', JSON.stringify(cervejasSalvas));

    alert("Cerveja cadastrada com sucesso!");

    // Limpa os campos da tela após o salvamento
    setNome('');
    setPreco('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Cadastro Mars Cervejaria</h2>
      
      {/* O evento onSubmit dispara a função de validação e salvamento */}
      <form onSubmit={handleCadastrar}>
        <div>
          <label>Nome do Produto (Cerveja):</label>
          <input 
            type="text" 
            placeholder="Ex: IPA Especial" 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required // Impede o envio se estiver vazio
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>
        
        <br />
        
        <div>
          <label>Preço (R$):</label>
          <input 
            type="number" 
            placeholder="0.00" 
            step="0.01" // Permite a digitação de centavos
            min="0.01"  // Validação nativa para não aceitar 0 ou valores negativos
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required // Impede o envio se estiver vazio
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>
        
        <br />
        
        <button 
          type="submit" 
          style={{ padding: '8px 15px', cursor: 'pointer' }}
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default Formulario;
