import React, { useState } from 'react';
import './Formulario.css';

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
      // MODO CADASTRO: Cria uma nova cerveja
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

  const editando = !!idEdicao;

  return (
    <div className="container-formulario">
      <h1>🍻 Cadastro de Cervejas</h1>

      <section className="formulario-section">
        <h2>{editando ? '✏️ Editar Cerveja' : '➕ Nova Cerveja'}</h2>
        
        <form onSubmit={handleCadastrar}>
          <div className="form-row">
            <div className="form-group">
              <label>Nome do Produto *</label>
              <input 
                type="text" 
                placeholder="Ex: IPA Especial" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Preço (R$) *</label>
              <input 
                type="number" 
                placeholder="0.00" 
                step="0.01" 
                min="0.01"  
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="btn-salvar">
              {editando ? '✏️ Atualizar' : '➕ Cadastrar'}
            </button>
            {editando && (
              <button 
                type="button" 
                className="btn-cancelar"
                onClick={() => { setIdEdicao(null); setNome(''); setPreco(''); }}
              >
                ❌ Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="listagem-section">
        <h2>Lista de Cervejas</h2>
        {cervejas.length === 0 ? (
          <p className="sem-dados">Nenhuma cerveja cadastrada ainda.</p>
        ) : (
          <div className="table-wrapper">
            <table className="tabela-cervejas">
              <thead>
                <tr>
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
                        className="btn-editar"
                        onClick={() => handleIniciarEdicao(cerveja)}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className="btn-deletar"
                        onClick={() => handleExcluir(cerveja.id)}
                      >
                        🗑️ Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Formulario;
