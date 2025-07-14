/**
 * Utility functions for analyzing cocktail ingredients
 */

/**
 * Analyzes the structure of cocktail ingredients and extracts unique ingredients
 * @param {Array} cocktails - Array of cocktail objects
 * @returns {Object} Analysis results including unique ingredients, structure info, and statistics
 */
export function analyzeIngredients(cocktails) {
  if (!Array.isArray(cocktails)) {
    throw new Error('Input must be an array of cocktails');
  }

  const uniqueIngredients = new Set();
  const ingredientStructures = [];
  const ingredientStats = {
    totalIngredients: 0,
    averageIngredientsPerCocktail: 0,
    ingredientFrequency: {},
    unitTypes: new Set(),
    amountTypes: new Set()
  };

  // Analyze each cocktail
  cocktails.forEach((cocktail, index) => {
    if (!cocktail.ingredients || !Array.isArray(cocktail.ingredients)) {
      console.warn(`Cocktail at index ${index} has invalid ingredients array`);
      return;
    }

    // Store a sample of ingredient structures for analysis
    if (ingredientStructures.length < 10) {
      ingredientStructures.push({
        cocktailName: cocktail.name,
        ingredients: cocktail.ingredients.map(ing => ({
          structure: Object.keys(ing).sort(),
          example: ing
        }))
      });
    }

    // Process each ingredient
    cocktail.ingredients.forEach(ingredient => {
      ingredientStats.totalIngredients++;

      // Extract ingredient name
      if (ingredient.ingredient) {
        const ingredientName = ingredient.ingredient;
        uniqueIngredients.add(ingredientName);
        
        // Track frequency
        ingredientStats.ingredientFrequency[ingredientName] = 
          (ingredientStats.ingredientFrequency[ingredientName] || 0) + 1;
      }

      // Track unit types
      if (ingredient.unit) {
        ingredientStats.unitTypes.add(ingredient.unit);
      }

      // Track amount types
      if (ingredient.amount) {
        ingredientStats.amountTypes.add(typeof ingredient.amount);
      }

      // Track special cases
      if (ingredient.special) {
        ingredientStats.amountTypes.add('special');
      }
    });
  });

  // Calculate averages
  ingredientStats.averageIngredientsPerCocktail = 
    ingredientStats.totalIngredients / cocktails.length;

  // Convert Sets to Arrays for easier consumption
  const result = {
    uniqueIngredients: Array.from(uniqueIngredients).sort(),
    totalUniqueIngredients: uniqueIngredients.size,
    ingredientStructures,
    stats: {
      ...ingredientStats,
      unitTypes: Array.from(ingredientStats.unitTypes),
      amountTypes: Array.from(ingredientStats.amountTypes)
    }
  };

  return result;
}

/**
 * Gets the most common ingredients across all cocktails
 * @param {Array} cocktails - Array of cocktail objects
 * @param {number} limit - Number of top ingredients to return (default: 10)
 * @returns {Array} Array of {ingredient, count} objects sorted by frequency
 */
export function getMostCommonIngredients(cocktails, limit = 10) {
  const analysis = analyzeIngredients(cocktails);
  
  return Object.entries(analysis.stats.ingredientFrequency)
    .map(([ingredient, count]) => ({ ingredient, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Finds cocktails that contain specific ingredients
 * @param {Array} cocktails - Array of cocktail objects
 * @param {Array} targetIngredients - Array of ingredient names to search for
 * @returns {Array} Array of cocktails containing any of the target ingredients
 */
export function findCocktailsByIngredients(cocktails, targetIngredients) {
  const targetSet = new Set(targetIngredients.map(ing => ing.toLowerCase()));
  
  return cocktails.filter(cocktail => {
    return cocktail.ingredients.some(ingredient => 
      ingredient.ingredient && 
      targetSet.has(ingredient.ingredient.toLowerCase())
    );
  });
}

/**
 * Groups ingredients by category/type (basic categorization)
 * @param {Array} uniqueIngredients - Array of unique ingredient names
 * @returns {Object} Object with ingredients grouped by category
 */
export function categorizeIngredients(uniqueIngredients) {
  const categories = {
    spirits: [],
    liqueurs: [],
    juices: [],
    syrups: [],
    bitters: [],
    garnishes: [],
    mixers: [],
    other: []
  };

  uniqueIngredients.forEach(ingredient => {
    const lower = ingredient.toLowerCase();
    
    if (lower.includes('vodka') || lower.includes('gin') || lower.includes('rum') || 
        lower.includes('whiskey') || lower.includes('tequila') || lower.includes('cognac') ||
        lower.includes('brandy') || lower.includes('bourbon') || lower.includes('scotch') ||
        lower.includes('pisco') || lower.includes('cachaca') || lower.includes('absinthe')) {
      categories.spirits.push(ingredient);
    } else if (lower.includes('liqueur') || lower.includes('sec') || lower.includes('curaçao') ||
               lower.includes('cointreau') || lower.includes('drambuie') || lower.includes('disaronno') ||
               lower.includes('galliano') || lower.includes('kahlúa') || lower.includes('baileys') ||
               lower.includes('créme') || lower.includes('crème') || lower.includes('maraschino') ||
               lower.includes('aperol') || lower.includes('campari') || lower.includes('bénédictine')) {
      categories.liqueurs.push(ingredient);
    } else if (lower.includes('juice') || lower.includes('puree')) {
      categories.juices.push(ingredient);
    } else if (lower.includes('syrup') || lower.includes('nectar') || lower.includes('honey')) {
      categories.syrups.push(ingredient);
    } else if (lower.includes('bitters')) {
      categories.bitters.push(ingredient);
    } else if (lower.includes('twist') || lower.includes('slice') || lower.includes('wedge') ||
               lower.includes('cherry') || lower.includes('olive') || lower.includes('mint') ||
               lower.includes('lime') && !lower.includes('juice')) {
      categories.garnishes.push(ingredient);
    } else if (lower.includes('soda') || lower.includes('water') || lower.includes('cola') ||
               lower.includes('beer') || lower.includes('ale') || lower.includes('champagne') ||
               lower.includes('prosecco') || lower.includes('wine') || lower.includes('cream') ||
               lower.includes('milk') || lower.includes('coffee') || lower.includes('tea')) {
      categories.mixers.push(ingredient);
    } else {
      categories.other.push(ingredient);
    }
  });

  return categories;
}