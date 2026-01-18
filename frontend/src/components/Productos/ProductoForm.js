import React, { useState, useEffect } from 'react';
import { productosService, categoriasService, proveedoresService } from '../../services/inventarioService';
import './ProductoForm.css';

function ProductoForm({ producto, onClose, onSave }) {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    cantidad: 0,
    precio_unidad: '',
    proveedor: '',
    categoria: '',
    activo: true
  });

  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
    if (producto) {
      setFormData({
        codigo: producto.codigo || '',
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        cantidad: producto.cantidad || 0,
        precio_unidad: producto.precio_unidad || '',
        proveedor: producto.proveedor || '',
        categoria: producto.categoria || '',
        activo: producto.activo !== undefined ? producto.activo : true
      });
    }
  }, [producto]);

  const cargarDatos = async () => {
    try {
      const [categoriasRes, proveedoresRes] = await Promise.all([
        categoriasService.getAll(),
        proveedoresService.getAll()
      ]);
      // Manejar respuesta paginada
      setCategorias(categoriasRes.data.results || categoriasRes.data || []);
      setProveedores(proveedoresRes.data.results || proveedoresRes.data || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar categorías y proveedores');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const newErrors = {};
    
    if (!formData.codigo.trim()) newErrors.codigo = 'El código es requerido';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';
    if (formData.cantidad < 0) newErrors.cantidad = 'La cantidad no puede ser negativa';
    if (!formData.precio_unidad || parseFloat(formData.precio_unidad) <= 0) {
      newErrors.precio_unidad = 'El precio debe ser mayor a 0';
    }
    if (!formData.proveedor) newErrors.proveedor = 'Debe seleccionar un proveedor';
    if (!formData.categoria) newErrors.categoria = 'Debe seleccionar una categoría';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    try {
      if (producto) {
        await productosService.update(producto.id, formData);
      } else {
        await productosService.create(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error guardando producto:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        alert('Error al guardar el producto');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{producto ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="producto-form">
          <div className="form-row">
            <div className="form-group">
              <label>Código *</label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                className={errors.codigo ? 'error' : ''}
                disabled={!!producto}
              />
              {errors.codigo && <span className="error-msg">{errors.codigo}</span>}
            </div>

            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={errors.nombre ? 'error' : ''}
              />
              {errors.nombre && <span className="error-msg">{errors.nombre}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Descripción *</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className={errors.descripcion ? 'error' : ''}
              rows="3"
            />
            {errors.descripcion && <span className="error-msg">{errors.descripcion}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cantidad *</label>
              <input
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                className={errors.cantidad ? 'error' : ''}
                min="0"
              />
              {errors.cantidad && <span className="error-msg">{errors.cantidad}</span>}
            </div>

            <div className="form-group">
              <label>Precio por Unidad *</label>
              <input
                type="number"
                name="precio_unidad"
                value={formData.precio_unidad}
                onChange={handleChange}
                className={errors.precio_unidad ? 'error' : ''}
                step="0.01"
                min="0.01"
              />
              {errors.precio_unidad && <span className="error-msg">{errors.precio_unidad}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Proveedor *</label>
              <select
                name="proveedor"
                value={formData.proveedor}
                onChange={handleChange}
                className={errors.proveedor ? 'error' : ''}
              >
                <option value="">Seleccione un proveedor</option>
                {proveedores.map(prov => (
                  <option key={prov.id} value={prov.id}>{prov.nombre}</option>
                ))}
              </select>
              {errors.proveedor && <span className="error-msg">{errors.proveedor}</span>}
            </div>

            <div className="form-group">
              <label>Categoría *</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className={errors.categoria ? 'error' : ''}
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre_display || cat.nombre}
                  </option>
                ))}
              </select>
              {errors.categoria && <span className="error-msg">{errors.categoria}</span>}
            </div>
          </div>

          {producto && (
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleChange}
                />
                Producto activo
              </label>
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductoForm;
