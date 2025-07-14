/**
 * TypeScript utility functions for analyzing cocktail ingredients
 */

// Type definitions for cocktail data structure
export interface Ingredient {
  ingredient: string;
  unit?: string;
  amount?: number | string;
  label?: string;
  special?: string;
}

export interface Cocktail {
  iba: boolean;
  name: string;
  colors: string | string[];
  glass: string;
  category?: string;
  ingredients: Ingredient[];
  garnish?: string;
  preparation: string;
  searchTerm?: string;
}

export interface IngredientAnalysis {
  uniqueIngredients: string[];
  totalUniqueIngredients: number;
  ingredientStructures: IngredientStructure[];
  stats: IngredientStats;
}

export interface IngredientStructure {
  cocktailName: string;
  ingredients: {
    structure: string[];
    example: Ingredient;
  }[];
}

export interface IngredientStats {
  totalIngredients: number;
  averageIngredientsPerCocktail: number;
  ingredientFrequency: Record<string, number>;
  unitTypes: string[];
  amountTypes: string[];
}

export interface IngredientFrequency {
  ingredient: string;
  count: number;
}

export interface CategorizedIngredients {
  spirits: string[];
  liqueurs: string[];
  juices: string[];
  syrups: string[];
  bitters: string[];
  garnishes: string[];
  mixers: string[];
  other: string[];
}

/**
 * Analyzes the structure of cocktail ingredients and extracts unique ingredients
 * @param cocktails - Array of cocktail objects
 * @returns Analysis results including unique ingredients, structure info, and statistics
 */
export function analyzeIngredients(cocktails: Cocktail[]): IngredientAnalysis {
  if (!Array.isArray(cocktails)) {
    throw new Error('Input must be an array of cocktails');
  }

  const uniqueIngredients = new Set<string>();
  const ingredientStructures: IngredientStructure[] = [];
  const ingredientStats: IngredientStats = {
    totalIngredients: 0,
    averageIngredientsPerCocktail: 0,
    ingredientFrequency: {},
    unitTypes: [],
    amountTypes: []
  };

  const unitTypes = new Set<string>();
  const amountTypes = new Set<string>();

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
        unitTypes.add(ingredient.unit);
      }

      // Track amount types
      if (ingredient.amount) {
        amountTypes.add(typeof ingredient.amount);
      }

      // Track special cases
      if (ingredient.special) {
        amountTypes.add('special');
      }
    });
  });

  // Calculate averages
  ingredientStats.averageIngredientsPerCocktail = 
    ingredientStats.totalIngredients / cocktails.length;

  // Convert Sets to Arrays for easier consumption
  ingredientStats.unitTypes = Array.from(unitTypes);
  ingredientStats.amountTypes = Array.from(amountTypes);

  return {
    uniqueIngredients: Array.from(uniqueIngredients).sort(),
    totalUniqueIngredients: uniqueIngredients.size,
    ingredientStructures,
    stats: ingredientStats
  };
}

/**
 * Gets the most common ingredients across all cocktails
 * @param cocktails - Array of cocktail objects
 * @param limit - Number of top ingredients to return (default: 10)
 * @returns Array of {ingredient, count} objects sorted by frequency
 */
export function getMostCommonIngredients(cocktails: Cocktail[], limit: number = 10): IngredientFrequency[] {
  const analysis = analyzeIngredients(cocktails);
  
  return Object.entries(analysis.stats.ingredientFrequency)
    .map(([ingredient, count]) => ({ ingredient, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Finds cocktails that contain specific ingredients
 * @param cocktails - Array of cocktail objects
 * @param targetIngredients - Array of ingredient names to search for
 * @returns Array of cocktails containing any of the target ingredients
 */
export function findCocktailsByIngredients(cocktails: Cocktail[], targetIngredients: string[]): Cocktail[] {
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
 * @param uniqueIngredients - Array of unique ingredient names
 * @returns Object with ingredients grouped by category
 */
export function categorizeIngredients(uniqueIngredients: string[]): CategorizedIngredients {
  const categories: CategorizedIngredients = {
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

/**
 * Extracts all unique ingredient names from the cocktails data
 * @param cocktails - Array of cocktail objects
 * @returns Array of unique ingredient names sorted alphabetically
 */
export function extractUniqueIngredients(cocktails: Cocktail[]): string[] {
  const uniqueIngredients = new Set<string>();
  
  cocktails.forEach(cocktail => {
    if (cocktail.ingredients && Array.isArray(cocktail.ingredients)) {
      cocktail.ingredients.forEach(ingredient => {
        if (ingredient.ingredient) {
          uniqueIngredients.add(ingredient.ingredient);
        }
      });
    }
  });
  
  return Array.from(uniqueIngredients).sort();
}

/**
 * Utility function to load and parse cocktails from JSON file
 * @param jsonData - Raw JSON data
 * @returns Parsed cocktail array
 */
export function parseCocktailsFromJSON(jsonData: string): Cocktail[] {
  try {
    const cocktails = JSON.parse(jsonData) as Cocktail[];
    if (!Array.isArray(cocktails)) {
      throw new Error('JSON data must be an array of cocktails');
    }
    return cocktails;
  } catch (error) {
    throw new Error(`Failed to parse cocktails JSON: ${error}`);
  }
}

/**
 * Comprehensive analysis function that provides all insights
 * @param cocktails - Array of cocktail objects
 * @returns Complete analysis including ingredients, categories, and statistics
 */
export function getCompleteIngredientAnalysis(cocktails: Cocktail[]) {
  const analysis = analyzeIngredients(cocktails);
  const categorized = categorizeIngredients(analysis.uniqueIngredients);
  const mostCommon = getMostCommonIngredients(cocktails, 20);
  
  return {
    totalCocktails: cocktails.length,
    totalUniqueIngredients: analysis.totalUniqueIngredients,
    uniqueIngredients: analysis.uniqueIngredients,
    categorizedIngredients: categorized,
    mostCommonIngredients: mostCommon,
    statistics: analysis.stats,
    sampleStructures: analysis.ingredientStructures
  };
}