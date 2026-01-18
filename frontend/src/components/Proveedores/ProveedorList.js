import React, { useState, useEffect } from 'react';
import { proveedoresService } from '../../services/inventarioService';
import './ProveedorList.css';

function ProveedorList() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    setLoading(true);
    try {
      const response = await proveedoresService.getAll();
      setProveedores(response.data.results || response.data);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
      alert('Error al cargar proveedores');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      telefono: '',
      email: '',
      direccion: ''
    });
    setErrors({});
    setSelectedProveedor(null);
  };

  const handleNuevo = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditar = (proveedor) => {
    setFormData(proveedor);
    setSelectedProveedor(proveedor);
    setShowForm(true);
  };

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de eliminar el proveedor "${nombre}"?`)) {
      try {
        await proveedoresService.delete(id);
        cargarProveedores();
      } catch (error) {
        console.error('Error eliminando proveedor:', error);
        alert('Error al eliminar proveedor. Puede tener productos asociados.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    try {
      if (selectedProveedor) {
        await proveedoresService.update(selectedProveedor.id, formData);
      } else {
        await proveedoresService.create(formData);
      }
      setShowForm(false);
      resetForm();
      cargarProveedores();
    } catch (error) {
      console.error('Error guardando proveedor:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        alert('Error al guardar proveedor');
      }
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="proveedor-list-container">
      <div className="list-header">
        <h1>Gestión de Proveedores</h1>
        <button onClick={handleNuevo} className="btn-nuevo">
          + Nuevo Proveedor
        </button>
      </div>

      {loading ? (
        <div className="loading">Cargando proveedores...</div>
      ) : (
        <div className="proveedores-grid">
          {proveedores.map(proveedor => (
            <div key={proveedor.id} className="proveedor-card">
              <div className="card-header">
                <h3>{proveedor.nombre}</h3>
                <div className="card-actions">
                  <button
                    onClick={() => handleEditar(proveedor)}
                    className="btn-accion btn-editar"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleEliminar(proveedor.id, proveedor.nombre)}
                    className="btn-accion btn-eliminar"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="card-body">
                <p><strong>Teléfono:</strong> {proveedor.telefono}</p>
                <p><strong>Email:</strong> {proveedor.email}</p>
                <p><strong>Dirección:</strong> {proveedor.direccion}</p>
                <p className="fecha-creacion">
                  <small>Creado: {formatearFecha(proveedor.fecha_creacion)}</small>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="proveedor-form">
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

              <div className="form-group">
                <label>Teléfono *</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={errors.telefono ? 'error' : ''}
                />
                {errors.telefono && <span className="error-msg">{errors.telefono}</span>}
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-msg">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Dirección *</label>
                <textarea
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className={errors.direccion ? 'error' : ''}
                  rows="3"
                />
                {errors.direccion && <span className="error-msg">{errors.direccion}</span>}
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProveedorList;
