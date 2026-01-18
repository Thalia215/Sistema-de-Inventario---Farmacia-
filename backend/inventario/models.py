from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from decimal import Decimal


class Proveedor(models.Model):
    """Modelo para proveedores de la farmacia"""
    nombre = models.CharField(max_length=200, verbose_name='Nombre del Proveedor')
    telefono = models.CharField(max_length=20, verbose_name='Teléfono')
    email = models.EmailField(verbose_name='Correo Electrónico')
    direccion = models.TextField(verbose_name='Dirección')
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación')

    class Meta:
        verbose_name = 'Proveedor'
        verbose_name_plural = 'Proveedores'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Categoria(models.Model):
    """Modelo para categorías de productos"""
    CATEGORIAS_CHOICES = [
        ('ANALGESICOS', 'Analgésicos'),
        ('ANTIBIOTICOS', 'Antibióticos'),
        ('ANTIGRIPALES', 'Antigripales'),
        ('VITAMINAS', 'Vitaminas'),
        ('ANTIINFLAMATORIOS', 'Antiinflamatorios'),
        ('ANTIALERGICOS', 'Antialérgicos'),
    ]
    
    nombre = models.CharField(
        max_length=50,
        choices=CATEGORIAS_CHOICES,
        unique=True,
        verbose_name='Categoría'
    )

    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'
        ordering = ['nombre']

    def __str__(self):
        return self.get_nombre_display()


class Producto(models.Model):
    """Modelo para productos de la farmacia"""
    codigo = models.CharField(max_length=50, unique=True, verbose_name='Código')
    nombre = models.CharField(max_length=200, verbose_name='Nombre del Producto')
    descripcion = models.TextField(verbose_name='Descripción')
    cantidad = models.IntegerField(
        validators=[MinValueValidator(0)],
        verbose_name='Cantidad en Stock'
    )
    precio_unidad = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name='Precio por Unidad'
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación')
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name='Fecha de Actualización')
    id_usuario_creador = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='productos_creados',
        verbose_name='Usuario Creador'
    )
    proveedor = models.ForeignKey(
        Proveedor,
        on_delete=models.PROTECT,
        related_name='productos',
        verbose_name='Proveedor'
    )
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.PROTECT,
        related_name='productos',
        verbose_name='Categoría'
    )
    activo = models.BooleanField(default=True, verbose_name='Activo')

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
        ordering = ['-fecha_creacion']
        indexes = [
            models.Index(fields=['codigo']),
            models.Index(fields=['activo']),
            models.Index(fields=['categoria']),
        ]

    def __str__(self):
        return f"{self.codigo} - {self.nombre}"

    def eliminar_logico(self):
        """Método para eliminación lógica"""
        self.activo = False
        self.save()
