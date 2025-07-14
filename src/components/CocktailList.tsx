import { Cocktail } from '@/types/cocktail';
import CocktailCard from './CocktailCard';
import styles from './CocktailCard.module.css';

interface CocktailListProps {
  cocktails: Cocktail[];
  selectedIngredients: string[];
}

export default function CocktailList({ cocktails, selectedIngredients }: CocktailListProps) {
  if (cocktails.length === 0) {
    return (
      <div className={styles.noResults}>
        {selectedIngredients.length === 0 
          ? "Select ingredients to find cocktails you can make!"
          : `No cocktails found with the selected ingredients: ${selectedIngredients.join(', ')}`
        }
      </div>
    );
  }

  return (
    <div>
      <div className={styles.resultsCount}>
        Found {cocktails.length} cocktail{cocktails.length !== 1 ? 's' : ''} 
        {selectedIngredients.length > 0 && (
          <span> with: {selectedIngredients.join(', ')}</span>
        )}
      </div>
      {cocktails.map((cocktail, index) => (
        <CocktailCard key={index} cocktail={cocktail} />
      ))}
    </div>
  );
}