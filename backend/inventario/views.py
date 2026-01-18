from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Proveedor, Categoria, Producto
from .serializers import (
    ProveedorSerializer, 
    CategoriaSerializer, 
    ProductoSerializer,
    ProductoListSerializer
)


class ProveedorViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar proveedores.
    Permite listar, crear, actualizar, y eliminar proveedores.
    """
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'email', 'telefono']
    ordering_fields = ['nombre', 'fecha_creacion']
    ordering = ['nombre']


class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para gestionar categorías.
    Solo permite listar categorías (lectura).
    """
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class ProductoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar productos.
    Permite CRUD completo con eliminación lógica.
    """
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'proveedor', 'activo']
    search_fields = ['codigo', 'nombre', 'descripcion']
    ordering_fields = ['nombre', 'precio_unidad', 'cantidad', 'fecha_creacion']
    ordering = ['-fecha_creacion']

    def get_queryset(self):
        """
        Filtrar productos activos por defecto.
        Para ver todos incluir ?mostrar_inactivos=true
        """
        queryset = Producto.objects.select_related('proveedor', 'categoria', 'id_usuario_creador')
        
        # Filtrar solo activos por defecto
        mostrar_inactivos = self.request.query_params.get('mostrar_inactivos', 'false')
        if mostrar_inactivos.lower() != 'true':
            queryset = queryset.filter(activo=True)
        
        return queryset

    def get_serializer_class(self):
        """Usar serializer simplificado para listar"""
        if self.action == 'list':
            return ProductoListSerializer
        return ProductoSerializer

    def perform_create(self, serializer):
        """Asignar usuario creador al crear producto"""
        if self.request.user.is_authenticated:
            serializer.save(id_usuario_creador=self.request.user)
        else:
            serializer.save()

    @action(detail=True, methods=['post'])
    def eliminar(self, request, pk=None):
        """
        Endpoint personalizado para eliminación lógica.
        POST /api/productos/{id}/eliminar/
        """
        producto = self.get_object()
        producto.eliminar_logico()
        return Response(
            {'mensaje': f'Producto {producto.nombre} desactivado correctamente.'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def activar(self, request, pk=None):
        """
        Endpoint para reactivar un producto.
        POST /api/productos/{id}/activar/
        """
        producto = self.get_object()
        producto.activo = True
        producto.save()
        return Response(
            {'mensaje': f'Producto {producto.nombre} activado correctamente.'},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def por_categoria(self, request):
        """
        Filtrar productos por categoría.
        GET /api/productos/por_categoria/?categoria=ANALGESICOS
        """
        categoria_param = request.query_params.get('categoria', None)
        if not categoria_param:
            return Response(
                {'error': 'Debe proporcionar el parámetro categoria'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        productos = self.get_queryset().filter(categoria__nombre=categoria_param)
        serializer = self.get_serializer(productos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def bajo_stock(self, request):
        """
        Obtener productos con bajo stock (cantidad < 10).
        GET /api/productos/bajo_stock/
        """
        minimo = int(request.query_params.get('minimo', 10))
        productos = self.get_queryset().filter(cantidad__lt=minimo)
        serializer = self.get_serializer(productos, many=True)
        return Response(serializer.data)
