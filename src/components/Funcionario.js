import React from 'react';

function Funcionario() {
  return (
    <>
      {/* Barra superior simples */}
      <nav className='navbar navbar-dark bg-dark mb-5'>
        <span className='navbar-brand ms-3'>Painel do Funcionário - AutoCampos</span> 
      </nav>

      {/* Cards de ações administrativas */}
      <main className='container'>
        <h2>Painel Administrativo</h2>

        {/* Cards para cada ação */}
        <section className='row mt-4 g-3'>
          {/* Gerenciar Carros */}
          <article className='col-md-4'>
            <div className='card h-100 text-center shadow-sm p-3'>
              🚗<br/>
              Gerenciar Carros<br/>
              {/* Botão fictício */}
              <button disabled={true} style={{marginTop:"10px"}}className='btn btn-outline-secondary btn-sm'>Acessar</button> 
            </div>  
          </article>

          {/* Gerenciar Visitas */}
          <article className='col-md-4'>
            <div className='card h-100 text-center shadow-sm p-3'>
              📅<br/>
              Gerenciar Visitas<br/>
              {/* Botão fictício */}
              <button disabled={true} style={{marginTop:"10px"}}className='btn btn-outline-secondary btn-sm'>Acessar</button> 
            </div>  
          </article>

           {/* Gerenciar Vendas */}
           <article className='col-md-4'>
            <div className='card h-100 text-center shadow-sm p-3'>
              💰<br/>
              Gerenciar Vendas<br/>
              {/* Botão fictício */}
              <button disabled={true} style={{marginTop:"10px"}}className='btn btn-outline-secondary btn-sm'>Acessar</button> 
            </div>  
           </article>

        </section>

      </main>

    </>
  );
}

export default Funcionario;