from django.core.management.base import BaseCommand
from api.utils.scraper import parse_generic_recipe
from api.models import Recipe, Ingredient, RecipeIngredient

class Command(BaseCommand):
    help = "Import a recipe from a given URL and save it in the DB"

    def add_arguments(self, parser):
        parser.add_argument("url", type=str, help="Recipe URL")

    def handle(self, *args, **options):
        url = options["url"]
        self.stdout.write(self.style.NOTICE(f"Fetching recipe from {url}..."))

        data = parse_generic_recipe(url)

        recipe, created = Recipe.objects.get_or_create(
            source_url=data["source_url"],
            defaults={
                "title": data["title"],
                "instructions": data["instructions"],
                "image_url": data.get("image_url"),
                "scraped": True,
            },
        )

        if not created:
            self.stdout.write(self.style.WARNING(f"Recipe already exists: {recipe.title}"))
            return

        for line in data["ingredients"]:
            parts = line.split()
            if not parts:
                continue

            ing_name = " ".join(parts[1:]) if parts[0].replace(".", "").isdigit() else line
            ing, _ = Ingredient.objects.get_or_create(name=ing_name.strip().capitalize())

            RecipeIngredient.objects.get_or_create(
                recipe=recipe,
                ingredient=ing,
                defaults={"notes": line},
            )

        self.stdout.write(self.style.SUCCESS(f"Imported recipe: {recipe.title}"))
