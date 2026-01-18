import React, { useState, useEffect } from 'react';
import { productosService, categoriasService } from '../../services/inventarioService';
import ProductoForm from './ProductoForm';
import './ProductoList.css';

function ProductoList() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [filtros, setFiltros] = useState({
    categoria: '',
    search: '',
    mostrar_inactivos: false
  });

  useEffect(() => {
    cargarCategorias();
    cargarProductos();
  }, [filtros]);

  const cargarCategorias = async () => {
    try {
      const response = await categoriasService.getAll();
      // Manejar respuesta paginada
      setCategorias(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setCategorias([]);
    }
  };

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filtros.categoria) params.categoria = filtros.categoria;
      if (filtros.search) params.search = filtros.search;
      if (filtros.mostrar_inactivos) params.mostrar_inactivos = 'true';

      const response = await productosService.getAll(params);
      setProductos(response.data.results || response.data);
    } catch (error) {
      console.error('Error cargando productos:', error);
      alert('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoProducto = () => {
    setSelectedProducto(null);
    setShowForm(true);
  };

  const handleEditarProducto = (producto) => {
    setSelectedProducto(producto);
    setShowForm(true);
  };

  const handleEliminarProducto = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de desactivar el producto "${nombre}"?`)) {
      try {
        await productosService.delete(id);
        cargarProductos();
      } catch (error) {
        console.error('Error eliminando producto:', error);
        alert('Error al eliminar producto');
      }
    }
  };

  const handleActivarProducto = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de activar el producto "${nombre}"?`)) {
      try {
        await productosService.activate(id);
        cargarProductos();
      } catch (error) {
        console.error('Error activando producto:', error);
        alert('Error al activar producto');
      }
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      categoria: '',
      search: '',
      mostrar_inactivos: false
    });
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(precio);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="producto-list-container">
      <div className="list-header">
        <h1>Gestión de Productos</h1>
        <button onClick={handleNuevoProducto} className="btn-nuevo">
          + Nuevo Producto
        </button>
      </div>

      <div className="filtros-container">
        <div className="filtro-item">
          <input
            type="text"
            name="search"
            placeholder="Buscar por código o nombre..."
            value={filtros.search}
            onChange={handleFiltroChange}
            className="search-input"
          />
        </div>

        <div className="filtro-item">
          <select
            name="categoria"
            value={filtros.categoria}
            onChange={handleFiltroChange}
            className="filtro-select"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre_display}</option>
            ))}
          </select>
        </div>

        <div className="filtro-item">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="mostrar_inactivos"
              checked={filtros.mostrar_inactivos}
              onChange={handleFiltroChange}
            />
            Mostrar inactivos
          </label>
        </div>

        <button onClick={limpiarFiltros} className="btn-limpiar">
          Limpiar filtros
        </button>
      </div>

      {loading ? (
        <div className="loading">Cargando productos...</div>
      ) : productos.length === 0 ? (
        <div className="no-data">No se encontraron productos</div>
      ) : (
        <div className="table-container">
          <table className="productos-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Proveedor</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(producto => (
                <tr key={producto.id} className={!producto.activo ? 'inactivo' : ''}>
                  <td>{producto.codigo}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria_nombre}</td>
                  <td>{producto.proveedor_nombre}</td>
                  <td className={producto.cantidad < 10 ? 'stock-bajo' : ''}>
                    {producto.cantidad}
                  </td>
                  <td>{formatearPrecio(producto.precio_unidad)}</td>
                  <td>
                    <span className={`badge ${producto.activo ? 'activo' : 'inactivo'}`}>
                      {producto.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>{formatearFecha(producto.fecha_creacion)}</td>
                  <td>
                    <div className="acciones">
                      <button
                        onClick={() => handleEditarProducto(producto)}
                        className="btn-accion btn-editar"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      {producto.activo ? (
                        <button
                          onClick={() => handleEliminarProducto(producto.id, producto.nombre)}
                          className="btn-accion btn-eliminar"
                          title="Desactivar"
                        >
                          🗑️
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivarProducto(producto.id, producto.nombre)}
                          className="btn-accion btn-activar"
                          title="Activar"
                        >
                          ✅
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ProductoForm
          producto={selectedProducto}
          onClose={() => setShowForm(false)}
          onSave={cargarProductos}
        />
      )}
    </div>
  );
}

export default ProductoList;
