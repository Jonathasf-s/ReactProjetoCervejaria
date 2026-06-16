import React, { useState } from 'react';

function Formulario() {
  // --- ESTADOS ---
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');

  // --- ESTADOS EXTRAS ---
  // Estado para controlar a lista de cervejas que aparece na tela (lendo do localStorage)
  const [cervejas, setCervejas] = useState(() => {
    const dadosSalvos = localStorage.getItem('mars_cervejas');
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  // Estado que avisa se estamos EDITANDO uma cerveja ou criando uma nova
  const [idEdicao, setIdEdicao] = useState(null);

  // --- FUNÇÃO DE SALVAR (CRIAÇÃO OU EDIÇÃO) ---
  const handleCadastrar = (e) => {
    e.preventDefault(); 

    // Validação de campos obrigatórios e válidos
    if (!nome.trim() || !preco || Number(preco) <= 0) {
      alert("Por favor, preencha um nome válido e um preço maior que zero.");
      return;
    }

    let listaAtualizada = [];

    if (idEdicao) {
      // MODO EDIÇÃO: Procura a cerveja pelo ID e altera os dados dela
      listaAtualizada = cervejas.map((cerveja) => {
        if (cerveja.id === idEdicao) {
          return { ...cerveja, nome: nome, preco: Number(preco).toFixed(2) };
        }
        return cerveja;
      });
      alert("Cerveja editada com sucesso!");
      setIdEdicao(null); // Desativa o modo edição após terminar
    } else {
      // MODO CADASTRO: Cria uma nova cerveja (Lógica que sua dupla começou)
      const novaCerveja = {
        id: Date.now().toString(), // Gera um ID único baseado no tempo
        nome: nome,
        preco: Number(preco).toFixed(2)
      };
      listaAtualizada = [...cervejas, novaCerveja];
      alert("Cerveja cadastrada com sucesso!");
    }

    // Atualiza a tela e salva na chave combinada do grupo ('mars_cervejas')
    setCervejas(listaAtualizada);
    localStorage.setItem('mars_cervejas', JSON.stringify(listaAtualizada));

    // Limpa os campos de texto da tela
    setNome('');
    setPreco('');
  };

  // --- FUNÇÃO DE EXCLUIR (DELETE) ---
  const handleExcluir = (idDeletar) => {
    if (window.confirm("Tem certeza que deseja excluir esta cerveja?")) {
      // Cria uma nova lista mantendo apenas as cervejas que têm o ID diferente do clicado
      const listaFiltrada = cervejas.filter((cerveja) => cerveja.id !== idDeletar);
      
      setCervejas(listaFiltrada);
      localStorage.setItem('mars_cervejas', JSON.stringify(listaFiltrada));
    }
  };

  // --- FUNÇÃO DE PREPARAR EDIÇÃO (UPDATE) ---
  const handleIniciarEdicao = (cerveja) => {
    setIdEdicao(cerveja.id); // Salva o ID para sabermos quem atualizar na hora do "Salvar"
    setNome(cerveja.nome);   // Coloca o nome da cerveja de volta na caixa de texto
    setPreco(cerveja.preco); // Coloca o preço de volta na caixa de texto
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Cadastro Mars Cervejaria</h2>
      
      {/* Formulário */}
      <form onSubmit={handleCadastrar}>
        <div>
          <label>Nome do Produto (Cerveja):</label>
          <input 
            type="text" 
            placeholder="Ex: IPA Especial" 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required 
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>
        
        <br />
        
        <div>
          <label>Preço (R$):</label>
          <input 
            type="number" 
            placeholder="0.00" 
            step="0.01" 
            min="0.01"  
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required 
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>
        
        <br />
        
        {/* Muda a cor e o texto do botão para o usuário saber se está editando ou cadastrando */}
        <button 
          type="submit" 
          style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: idEdicao ? '#ffc107' : '#007bff', color: idEdicao ? '#000' : '#fff', border: 'none', borderRadius: '4px' }}
        >
          {idEdicao ? 'Salvar Alterações' : 'Cadastrar'}
        </button>

        {idEdicao && (
          <button 
            type="button" 
            onClick={() => { setIdEdicao(null); setNome(''); setPreco(''); }} 
            style={{ marginLeft: '10px', padding: '8px 15px', cursor: 'pointer' }}
          >
            Cancelar Edição
          </button>
        )}
      </form>

      <hr style={{ margin: '30px 0' }} />

      {/* --- LISTAGEM DINÂMICA COM MAP() --- */}
      <h3>Cervejas Cadastradas</h3>
      {cervejas.length === 0 ? (
        <p>Nenhuma cerveja cadastrada ainda.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>Nome</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {cervejas.map((cerveja) => (
              <tr key={cerveja.id}>
                <td>{cerveja.nome}</td>
                <td>R$ {cerveja.preco}</td>
                <td>
                  <button 
                    onClick={() => handleIniciarEdicao(cerveja)}
                    style={{ marginRight: '10px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px' }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleExcluir(cerveja.id)}
                    style={{ cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px' }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Formulario;