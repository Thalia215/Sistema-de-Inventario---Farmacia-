# Guía de Instalación y Uso

## Configuración Inicial Rápida

### 1. Configurar Backend

```bash
# Ir al directorio backend
cd backend

# Crear entorno virtual (opcional pero recomendado)
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos
# Crear archivo .env basado en .env.example
# Actualizar credenciales de MySQL

# Crear base de datos en MySQL
mysql -u root -p
CREATE DATABASE farmacia_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Ejecutar migraciones
python manage.py makemigrations
python manage.py migrate

# Inicializar categorías
python manage.py init_categorias

# Crear superusuario (opcional)
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

### 2. Configurar Frontend

```bash
# Abrir nueva terminal
# Ir al directorio frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

### 3. Acceder a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Admin Django**: http://localhost:8000/admin/

## Uso de la Aplicación

### Gestión de Proveedores

1. Ir a la sección "Proveedores"
2. Crear proveedores antes de crear productos
3. Completar todos los campos requeridos

### Gestión de Productos

1. Ir a la sección "Productos"
2. Click en "+ Nuevo Producto"
3. Completar el formulario:
   - Código único
   - Nombre y descripción
   - Cantidad en stock
   - Precio
   - Seleccionar proveedor
   - Seleccionar categoría
4. Guardar

### Filtrar Productos

- Usar la barra de búsqueda para buscar por código o nombre
- Filtrar por categoría usando el selector
- Activar "Mostrar inactivos" para ver productos desactivados

### Eliminar/Activar Productos

- Click en el icono de papelera para desactivar (eliminación lógica)
- Click en el check verde para reactivar un producto inactivo

## Solución de Problemas

### Error de conexión con MySQL

1. Verificar que MySQL esté corriendo
2. Verificar credenciales en archivo `.env`
3. Verificar que la base de datos exista

### Error de CORS

- Verificar que el backend esté corriendo en puerto 8000
- Verificar configuración CORS en `settings.py`

### Error al crear productos

- Asegurarse de tener al menos un proveedor creado
- Verificar que las categorías estén inicializadas

## Pruebas con la API

### Usando cURL

```bash
# Listar productos
curl http://localhost:8000/api/productos/

# Crear proveedor
curl -X POST http://localhost:8000/api/proveedores/ \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Proveedor Test","telefono":"1234567","email":"test@test.com","direccion":"Calle 123"}'

# Listar categorías
curl http://localhost:8000/api/categorias/
```

### Usando el navegador

- Visitar: http://localhost:8000/api/
- Django REST Framework proporciona una interfaz web navegable

## Datos de Ejemplo

Crear un proveedor de ejemplo:
- Nombre: Droguería Central
- Teléfono: 310-555-0100
- Email: central@drogueria.com
- Dirección: Calle 50 #25-30

Crear un producto de ejemplo:
- Código: MED-001
- Nombre: Acetaminofén 500mg
- Descripción: Analgésico y antipirético
- Cantidad: 100
- Precio: 2500
- Categoría: Analgésicos
- Proveedor: Droguería Central
