from django.contrib import admin
from .models import Ingredient, Recipe, RecipeIngredient, PantryItem, MealPlan, MealPlanEntry

@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ("name", "default_unit", "created_by", "created_at")

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ("title", "created_by", "scraped", "created_at")
    search_fields = ("title", "description", "source_url")

@admin.register(RecipeIngredient)
class RecipeIngredientAdmin(admin.ModelAdmin):
    list_display = ("recipe", "ingredient", "quantity", "unit")

@admin.register(PantryItem)
class PantryItemAdmin(admin.ModelAdmin):
    list_display = ("user", "ingredient", "quantity", "unit")

@admin.register(MealPlan)
class MealPlanAdmin(admin.ModelAdmin):
    list_display = ("user", "name", "week_start")

@admin.register(MealPlanEntry)
class MealPlanEntryAdmin(admin.ModelAdmin):
    list_display = ("mealplan", "date", "meal_type", "recipe", "servings")
