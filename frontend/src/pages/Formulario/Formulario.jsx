import React from 'react';

function Formulario() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Cadastro Mars Cervejaria</h2>
      
      
      <form>
        <div>
          <label>Nome do Produto (Cerveja):</label>
          <input type="text" placeholder="Ex: IPA Especial" />
        </div>
        
        <br />
        
        <div>
          <label>Preço:</label>
          <input type="number" placeholder="0.00" />
        </div>
        
        <br />
        
        <button type="submit">Cadastrar</button>
      </form>
    

    </div>
  );
}

export default Formulario;