from django.db import models
from django.conf import settings

class Ingredient(models.Model):
    name = models.CharField(max_length=200, unique=True)
    default_unit = models.CharField(max_length=50, blank=True, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Recipe(models.Model):
    title = models.CharField(max_length=255)
    source_url = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True)
    servings = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    prep_time = models.PositiveIntegerField(null=True, blank=True, help_text="minutes")
    cook_time = models.PositiveIntegerField(null=True, blank=True, help_text="minutes")
    instructions = models.TextField(blank=True)
    image_url = models.URLField(blank=True, null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    scraped = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def total_time(self):
        return (self.prep_time or 0) + (self.cook_time or 0)

    def __str__(self):
        return self.title

class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, related_name="recipe_ingredients", on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.FloatField(null=True, blank=True)
    unit = models.CharField(max_length=50, blank=True, null=True)
    notes = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        unique_together = ("recipe", "ingredient")

    def __str__(self):
        q = f"{self.quantity} " if self.quantity else ""
        u = f"{self.unit} " if self.unit else ""
        return f"{q}{u}{self.ingredient.name}"

class PantryItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="pantry_items", on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.FloatField(default=0)
    unit = models.CharField(max_length=50, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "ingredient")

    def __str__(self):
        return f"{self.ingredient.name} — {self.quantity} {self.unit or ''}"

class MealPlan(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="meal_plans", on_delete=models.CASCADE)
    name = models.CharField(max_length=255, default="Weekly Plan")
    week_start = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.week_start})"

class MealPlanEntry(models.Model):
    MEAL_CHOICES = [
        ("breakfast", "Breakfast"),
        ("lunch", "Lunch"),
        ("dinner", "Dinner"),
        ("snack", "Snack"),
    ]

    mealplan = models.ForeignKey(MealPlan, related_name="entries", on_delete=models.CASCADE)
    date = models.DateField()
    meal_type = models.CharField(max_length=20, choices=MEAL_CHOICES)
    recipe = models.ForeignKey(Recipe, on_delete=models.SET_NULL, null=True, blank=True)
    servings = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("mealplan", "date", "meal_type")

    def __str__(self):
        return f"{self.date} {self.meal_type} — {self.recipe or '—'}"
