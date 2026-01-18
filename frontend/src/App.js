import React, { useState } from 'react';
import ProductoList from './components/Productos/ProductoList';
import ProveedorList from './components/Proveedores/ProveedorList';
import './App.css';

function App() {
  const [vistaActual, setVistaActual] = useState('productos');

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>Sistema de Inventario - Farmacia</h1>
          <nav className="nav-menu">
            <button
              className={`nav-btn ${vistaActual === 'productos' ? 'active' : ''}`}
              onClick={() => setVistaActual('productos')}
            >
              Productos
            </button>
            <button
              className={`nav-btn ${vistaActual === 'proveedores' ? 'active' : ''}`}
              onClick={() => setVistaActual('proveedores')}
            >
              Proveedores
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {vistaActual === 'productos' ? <ProductoList /> : <ProveedorList />}
      </main>

      <footer className="app-footer">
        <p>© 2026 Sistema de Gestión de Inventario para Farmacia</p>
      </footer>
    </div>
  );
}

export default App;
