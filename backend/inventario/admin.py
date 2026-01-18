from django.contrib import admin
from .models import Proveedor, Categoria, Producto


@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'telefono', 'email', 'fecha_creacion')
    search_fields = ('nombre', 'email', 'telefono')
    list_filter = ('fecha_creacion',)


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre')
    search_fields = ('nombre',)


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('id', 'codigo', 'nombre', 'cantidad', 'precio_unidad', 
                    'categoria', 'proveedor', 'activo', 'fecha_creacion')
    search_fields = ('codigo', 'nombre', 'descripcion')
    list_filter = ('categoria', 'activo', 'fecha_creacion', 'proveedor')
    list_editable = ('activo',)
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')
