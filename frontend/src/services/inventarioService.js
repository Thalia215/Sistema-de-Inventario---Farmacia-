import api from './api';

// Servicios para Productos
export const productosService = {
  getAll: (params = {}) => api.get('/productos/', { params }),
  getById: (id) => api.get(`/productos/${id}/`),
  create: (data) => api.post('/productos/', data),
  update: (id, data) => api.put(`/productos/${id}/`, data),
  delete: (id) => api.post(`/productos/${id}/eliminar/`),
  activate: (id) => api.post(`/productos/${id}/activar/`),
  porCategoria: (categoria) => api.get('/productos/por_categoria/', { params: { categoria } }),
  bajoStock: (minimo = 10) => api.get('/productos/bajo_stock/', { params: { minimo } }),
};

// Servicios para Proveedores
export const proveedoresService = {
  getAll: (params = {}) => api.get('/proveedores/', { params }),
  getById: (id) => api.get(`/proveedores/${id}/`),
  create: (data) => api.post('/proveedores/', data),
  update: (id, data) => api.put(`/proveedores/${id}/`, data),
  delete: (id) => api.delete(`/proveedores/${id}/`),
};

// Servicios para Categorías
export const categoriasService = {
  getAll: () => api.get('/categorias/'),
  getById: (id) => api.get(`/categorias/${id}/`),
};
