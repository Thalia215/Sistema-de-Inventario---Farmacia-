# Sistema de Gestión de Inventario para Farmacia

Sistema web completo para la gestión de inventario de una farmacia, desarrollado con Django REST Framework en el backend y React.js en el frontend.

##  Características

-  CRUD completo de productos
-  Gestión de proveedores
-  Categorías predefinidas de medicamentos
-  Eliminación lógica de productos
-  Filtros avanzados (por categoría, búsqueda, estado)
-  Alertas de stock bajo
-  Interfaz responsive y moderna
-  API REST completamente documentada

##  Requisitos Previos

- Python 3.8+
- Node.js 14+
- MySQL 5.7+

##  Instalación

### Backend (Django)

1. Navegar a la carpeta del backend:
```bash
cd backend
```

2. Crear un entorno virtual:
```bash
python -m venv venv
venv\Scripts\activate  # En Windows
source venv/bin/activate  # En Linux/Mac
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Configurar variables de entorno:
   - Copiar `.env.example` a `.env`
   - Actualizar las credenciales de MySQL

5. Crear la base de datos en MySQL:
```sql
CREATE DATABASE farmacia_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

6. Ejecutar migraciones:
```bash
python manage.py makemigrations
python manage.py migrate
```

7. Inicializar categorías:
```bash
python manage.py init_categorias
```

8. Crear superusuario (opcional):
```bash
python manage.py createsuperuser
```

9. Iniciar servidor:
```bash
python manage.py runserver
```

El backend estará disponible en: `http://localhost:8000`
Admin panel: `http://localhost:8000/admin`

### Frontend (React)

1. Navegar a la carpeta del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar servidor de desarrollo:
```bash
npm start
```

El frontend estará disponible en: `http://localhost:3000`

##  API Endpoints

### Productos
- `GET /api/productos/` - Listar productos activos
- `GET /api/productos/{id}/` - Obtener producto por ID
- `POST /api/productos/` - Crear nuevo producto
- `PUT /api/productos/{id}/` - Actualizar producto
- `POST /api/productos/{id}/eliminar/` - Desactivar producto (eliminación lógica)
- `POST /api/productos/{id}/activar/` - Activar producto
- `GET /api/productos/por_categoria/?categoria=ANALGESICOS` - Filtrar por categoría
- `GET /api/productos/bajo_stock/?minimo=10` - Productos con bajo stock

### Proveedores
- `GET /api/proveedores/` - Listar proveedores
- `GET /api/proveedores/{id}/` - Obtener proveedor por ID
- `POST /api/proveedores/` - Crear proveedor
- `PUT /api/proveedores/{id}/` - Actualizar proveedor
- `DELETE /api/proveedores/{id}/` - Eliminar proveedor

### Categorías
- `GET /api/categorias/` - Listar categorías disponibles
- `GET /api/categorias/{id}/` - Obtener categoría por ID

##  Estructura del Proyecto

```
farmacia-inventory/
├── backend/
│   ├── farmacia_project/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   ├── inventario/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── management/
│   │       └── commands/
│   │           └── init_categorias.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Productos/
│   │   │   │   ├── ProductoList.js
│   │   │   │   ├── ProductoList.css
│   │   │   │   ├── ProductoForm.js
│   │   │   │   └── ProductoForm.css
│   │   │   └── Proveedores/
│   │   │       ├── ProveedorList.js
│   │   │       └── ProveedorList.css
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── inventarioService.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   └── package.json
└── README.md
```

##  Categorías de Medicamentos

- Analgésicos
- Antibióticos
- Antigripales
- Vitaminas
- Antiinflamatorios
- Antialérgicos

##  Modelos de Datos

### Producto
- `id`: ID autogenerado
- `codigo`: Código único del producto
- `nombre`: Nombre del producto
- `descripcion`: Descripción detallada
- `cantidad`: Cantidad en stock
- `precio_unidad`: Precio por unidad
- `fecha_creacion`: Fecha de creación
- `fecha_actualizacion`: Fecha de última actualización
- `id_usuario_creador`: Usuario que creó el producto
- `proveedor`: Relación con Proveedor
- `categoria`: Relación con Categoría
- `activo`: Estado del producto (activo/inactivo)

### Proveedor
- `id`: ID autogenerado
- `nombre`: Nombre del proveedor
- `telefono`: Teléfono de contacto
- `email`: Email de contacto
- `direccion`: Dirección física
- `fecha_creacion`: Fecha de registro

### Categoría
- `id`: ID autogenerado
- `nombre`: Nombre de la categoría (choice field)

##  Tecnologías Utilizadas

### Backend
- Django 4.2
- Django REST Framework 3.14
- MySQL (PyMySQL - Python puro, no requiere compilación)
- django-cors-headers
- django-filter
- python-decouple

### Frontend
- React 18
- Axios
- CSS3

##  Notas Importantes

1. Asegúrese de que MySQL esté corriendo antes de iniciar el backend
2. El backend debe estar corriendo antes de iniciar el frontend
3. Las categorías deben inicializarse con el comando `init_categorias`
4. La eliminación de productos es lógica (no se borran de la base de datos)
5. Los proveedores no se pueden eliminar si tienen productos asociados

##  Contribución

Este proyecto fue desarrollado como parte de una prueba técnica para un sistema de gestión de inventario de farmacia.

##  Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
