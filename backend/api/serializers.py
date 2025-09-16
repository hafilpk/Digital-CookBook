from rest_framework import serializers
from .models import Ingredient, Recipe, RecipeIngredient, PantryItem, MealPlan, MealPlanEntry

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ["id", "name", "default_unit"]

class RecipeIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)
    ingredient_id = serializers.PrimaryKeyRelatedField(
        queryset=Ingredient.objects.all(), source="ingredient", write_only=True
    )

    class Meta:
        model = RecipeIngredient
        fields = ["id", "ingredient", "ingredient_id", "quantity", "unit", "notes"]

class RecipeSerializer(serializers.ModelSerializer):
    recipe_ingredients = RecipeIngredientSerializer(many=True, required=False)

    class Meta:
        model = Recipe
        fields = [
            "id",
            "title",
            "source_url",
            "description",
            "servings",
            "prep_time",
            "cook_time",
            "instructions",
            "image_url",
            "recipe_ingredients",
        ]

class PantryItemSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)
    ingredient_id = serializers.PrimaryKeyRelatedField(
        queryset=Ingredient.objects.all(), source="ingredient", write_only=True
    )

    class Meta:
        model = PantryItem
        fields = ["id", "ingredient", "ingredient_id", "quantity", "unit"]

class MealPlanEntrySerializer(serializers.ModelSerializer):
    recipe = RecipeSerializer(read_only=True)
    recipe_id = serializers.PrimaryKeyRelatedField(
        queryset=Recipe.objects.all(), source="recipe", write_only=True
    )

    class Meta:
        model = MealPlanEntry
        fields = ["id", "date", "meal_type", "recipe", "recipe_id", "servings", "order"]

class MealPlanSerializer(serializers.ModelSerializer):
    entries = MealPlanEntrySerializer(many=True, read_only=True)

    class Meta:
        model = MealPlan
        fields = ["id", "name", "start_date", "entries"]
