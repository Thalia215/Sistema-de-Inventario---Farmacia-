from django.core.management.base import BaseCommand
from inventario.models import Categoria


class Command(BaseCommand):
    help = 'Inicializa las categorías predefinidas'

    def handle(self, *args, **options):
        categorias = [
            'ANALGESICOS',
            'ANTIBIOTICOS',
            'ANTIGRIPALES',
            'VITAMINAS',
            'ANTIINFLAMATORIOS',
            'ANTIALERGICOS',
        ]

        for categoria_nombre in categorias:
            categoria, created = Categoria.objects.get_or_create(nombre=categoria_nombre)
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Categoría "{categoria.get_nombre_display()}" creada exitosamente')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Categoría "{categoria.get_nombre_display()}" ya existe')
                )

        self.stdout.write(self.style.SUCCESS('\n✓ Inicialización de categorías completada'))
