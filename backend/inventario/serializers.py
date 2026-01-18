from rest_framework import serializers
from .models import Proveedor, Categoria, Producto
from django.contrib.auth.models import User


class ProveedorSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Proveedor"""
    
    class Meta:
        model = Proveedor
        fields = ['id', 'nombre', 'telefono', 'email', 'direccion', 'fecha_creacion']
        read_only_fields = ['id', 'fecha_creacion']

    def validate_email(self, value):
        """Validación adicional para el email"""
        if Proveedor.objects.filter(email=value).exists():
            if not self.instance or self.instance.email != value:
                raise serializers.ValidationError("Ya existe un proveedor con este email.")
        return value


class CategoriaSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Categoria"""
    nombre_display = serializers.CharField(source='get_nombre_display', read_only=True)
    
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'nombre_display']
        read_only_fields = ['id']


class ProductoSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Producto"""
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    categoria_nombre = serializers.CharField(source='categoria.get_nombre_display', read_only=True)
    usuario_creador_nombre = serializers.CharField(
        source='id_usuario_creador.username', 
        read_only=True,
        allow_null=True
    )
    
    class Meta:
        model = Producto
        fields = [
            'id', 'codigo', 'nombre', 'descripcion', 'cantidad', 'precio_unidad',
            'fecha_creacion', 'fecha_actualizacion', 'id_usuario_creador',
            'usuario_creador_nombre', 'proveedor', 'proveedor_nombre',
            'categoria', 'categoria_nombre', 'activo'
        ]
        read_only_fields = ['id', 'fecha_creacion', 'fecha_actualizacion']

    def validate_codigo(self, value):
        """Validación para que el código sea único"""
        if Producto.objects.filter(codigo=value).exists():
            if not self.instance or self.instance.codigo != value:
                raise serializers.ValidationError("Ya existe un producto con este código.")
        return value

    def validate_cantidad(self, value):
        """Validación para la cantidad"""
        if value < 0:
            raise serializers.ValidationError("La cantidad no puede ser negativa.")
        return value

    def validate_precio_unidad(self, value):
        """Validación para el precio"""
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor a 0.")
        return value


class ProductoListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listar productos"""
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    categoria_nombre = serializers.CharField(source='categoria.get_nombre_display', read_only=True)
    
    class Meta:
        model = Producto
        fields = [
            'id', 'codigo', 'nombre', 'cantidad', 'precio_unidad',
            'proveedor_nombre', 'categoria_nombre', 'activo', 'fecha_creacion'
        ]
