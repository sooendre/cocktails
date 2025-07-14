import { readFileSync } from 'fs';
import { join } from 'path';
import { 
  Cocktail, 
  getCompleteIngredientAnalysis,
  extractUniqueIngredients,
  parseCocktailsFromJSON 
} from './src/utils/ingredient-analyzer';

// Load and parse the cocktails data
const cocktailsPath = join(__dirname, 'static', 'cocktails.json');
const cocktailsData = readFileSync(cocktailsPath, 'utf-8');
const cocktails: Cocktail[] = parseCocktailsFromJSON(cocktailsData);

// Perform comprehensive analysis
const analysis = getCompleteIngredientAnalysis(cocktails);

console.log('=== COCKTAIL INGREDIENTS ANALYSIS ===\n');

// 1. Basic statistics
console.log('1. BASIC STATISTICS:');
console.log(`   Total cocktails: ${analysis.totalCocktails}`);
console.log(`   Total unique ingredients: ${analysis.totalUniqueIngredients}`);
console.log(`   Average ingredients per cocktail: ${analysis.statistics.averageIngredientsPerCocktail.toFixed(2)}`);
console.log(`   Total ingredient instances: ${analysis.statistics.totalIngredients}`);

// 2. Ingredient structure analysis
console.log('\n2. INGREDIENT STRUCTURE ANALYSIS:');
console.log('   Unit types found:', analysis.statistics.unitTypes.join(', '));
console.log('   Amount types found:', analysis.statistics.amountTypes.join(', '));

console.log('\n   Sample ingredient structures:');
analysis.sampleStructures.slice(0, 5).forEach(sample => {
  console.log(`   ${sample.cocktailName}:`);
  sample.ingredients.forEach((ing, idx) => {
    console.log(`     ${idx + 1}. Fields: [${ing.structure.join(', ')}]`);
    console.log(`        Example: ${JSON.stringify(ing.example)}`);
  });
  console.log('');
});

// 3. Most common ingredients
console.log('3. MOST COMMON INGREDIENTS (Top 20):');
analysis.mostCommonIngredients.forEach((ing, idx) => {
  console.log(`   ${idx + 1}. ${ing.ingredient} (${ing.count} cocktails)`);
});

// 4. Categorized ingredients
console.log('\n4. INGREDIENTS BY CATEGORY:');
Object.entries(analysis.categorizedIngredients).forEach(([category, ingredients]) => {
  console.log(`   ${category.toUpperCase()} (${ingredients.length}):`);
  if (ingredients.length > 0) {
    ingredients.forEach((ing: string) => console.log(`     - ${ing}`));
  }
  console.log('');
});

// 5. Complete list of unique ingredients
console.log('5. COMPLETE LIST OF UNIQUE INGREDIENTS:');
const uniqueIngredients = extractUniqueIngredients(cocktails);
uniqueIngredients.forEach((ingredient, idx) => {
  console.log(`   ${idx + 1}. ${ingredient}`);
});

// 6. Detailed ingredient structure examples
console.log('\n6. DETAILED INGREDIENT STRUCTURE EXAMPLES:');
console.log('   Standard structure with unit and amount:');
console.log('   { "unit": "cl", "amount": 4.5, "ingredient": "Gin" }');
console.log('');
console.log('   With label:');
console.log('   { "unit": "cl", "amount": 2, "ingredient": "Vermouth", "label": "Sweet red vermouth" }');
console.log('');
console.log('   Without unit (dashes/drops):');
console.log('   { "amount": "2 dashes", "ingredient": "Angostura bitters" }');
console.log('');
console.log('   Special ingredients:');
console.log('   { "special": "Few dashes plain water" }');
console.log('');
console.log('   String amounts:');
console.log('   { "ingredient": "Mint", "amount": "6", "label": "Mint sprigs" }');

// Save detailed analysis to file
const analysisOutput = {
  summary: {
    totalCocktails: analysis.totalCocktails,
    totalUniqueIngredients: analysis.totalUniqueIngredients,
    averageIngredientsPerCocktail: analysis.statistics.averageIngredientsPerCocktail,
    totalIngredientInstances: analysis.statistics.totalIngredients
  },
  uniqueIngredients,
  categorizedIngredients: analysis.categorizedIngredients,
  mostCommonIngredients: analysis.mostCommonIngredients,
  statistics: analysis.statistics,
  sampleStructures: analysis.sampleStructures
};

import { writeFileSync } from 'fs';
writeFileSync('cocktail-analysis-results.json', JSON.stringify(analysisOutput, null, 2));
console.log('\nDetailed analysis saved to: cocktail-analysis-results.json');