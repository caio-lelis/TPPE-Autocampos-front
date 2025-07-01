import React from 'react';

function Anuncios() {
  // Exemplo estático de carros (depois você pode trocar por dados reais)
  const carros = [
    { id: 1, marca: "Toyota", modelo: "Corolla", preco: "R$80.000", imagem: "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=400&q=80"},
    { id: 2, marca: "Honda", modelo: "Civic", preco: "R$85.000", imagem: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=400&q=80"},
    { id: 3, marca: "Ford", modelo: "Ka", preco: "R$40.000", imagem:"https://images.unsplash.com/photo-1461632830798-3adb3034e4c8?auto=format&fit=crop&w=400&q=80"}
  ];

  return (
    <div className='container py-5'>
      <h2 className='mb-4'>Carros à Venda</h2>
      {/* Filtro por marca (exemplo visual) */}
      <div className='mb-4'>
        <select className='form-select' style={{maxWidth:'300px'}}>
          <option value="">Filtrar por Marca</option>
          {/* Depois preencha dinamicamente */}
          <option value='Toyota'>Toyota</option>
          <option value='Honda'>Honda</option>
          <option value='Ford'>Ford</option>
        </select>
      </div>

      {/* Lista de carros */}
      <div className='row g-4'>
        {carros.map(carro => (
          <div key={carro.id} className='col-md-4'>
            <div className='card h-100 shadow-sm'>
              <img src={carro.imagem} alt={carro.modelo} style={{height:'200px', objectFit:'cover'}}/>
              <div className='card-body'>
                <h5>{carro.marca} {carro.modelo}</h5>
                <p><strong>{carro.preco}</strong></p>
                {/* Botão fictício */}
                <button disabled className='btn btn-outline-primary w-100'>Ver detalhes</button> 
              </div>
            </div>
          </div>  
        ))}
      </div>

    </div>  
  );
}

export default Anuncios;