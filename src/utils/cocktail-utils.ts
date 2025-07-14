import { Cocktail } from '@/types/cocktail';

export function extractUniqueIngredients(cocktails: Cocktail[]): string[] {
  const ingredientSet = new Set<string>();

  cocktails.forEach(cocktail => {
    cocktail.ingredients.forEach(ingredient => {
      ingredientSet.add(ingredient.ingredient);
    });
  });

  return Array.from(ingredientSet).sort();
}

export function findCocktailsByIngredients(
  cocktails: Cocktail[],
  targetIngredients: string[]
): Cocktail[] {
  if (targetIngredients.length === 0) {
    return cocktails;
  }

  return cocktails.filter(cocktail => {
    const cocktailIngredients = cocktail.ingredients.filter(ingredient => ingredient.ingredient).map(
      ingredient => ingredient.ingredient.toLowerCase()
    );

    return targetIngredients.every(targetIngredient =>
      cocktailIngredients.some(cocktailIngredient =>
        cocktailIngredient.includes(targetIngredient.toLowerCase())
      )
    );
  });
}

export function findCocktailsByAnyIngredient(
  cocktails: Cocktail[],
  targetIngredients: string[]
): Cocktail[] {
  if (targetIngredients.length === 0) {
    return cocktails;
  }

  return cocktails.filter(cocktail => {
    const cocktailIngredients = cocktail.ingredients.filter(ingredient => ingredient.ingredient).map(
      ingredient => ingredient.ingredient.toLowerCase()
    );

    return targetIngredients.some(targetIngredient =>
      cocktailIngredients.some(cocktailIngredient =>
        cocktailIngredient.includes(targetIngredient.toLowerCase())
      )
    );
  });
}

export function filterIngredientsByQuery(
  ingredients: string[],
  query: string
): string[] {
  if (!query.trim()) {
    return ingredients;
  }

  return ingredients.filter(ingredient =>{
    if (ingredient) {
      return ingredient.toLowerCase().includes(query.toLowerCase())
    }
  }
  );
}