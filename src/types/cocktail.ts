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