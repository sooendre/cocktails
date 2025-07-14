import { Cocktail, Ingredient } from '@/types/cocktail';
import styles from './CocktailCard.module.css';

interface CocktailCardProps {
  cocktail: Cocktail;
}

export default function CocktailCard({ cocktail }: CocktailCardProps) {
  const formatIngredientAmount = (ingredient: Ingredient) => {
    if (ingredient.special) {
      return ingredient.special;
    }
    
    const parts = [];
    if (ingredient.amount) {
      parts.push(ingredient.amount);
    }
    if (ingredient.unit) {
      parts.push(ingredient.unit);
    }
    
    return parts.join(' ') || '';
  };

  const getIngredientDisplay = (ingredient: Ingredient) => {
    return ingredient.label || ingredient.ingredient;
  };

  const getColorStyle = () => {
    const colors = Array.isArray(cocktail.colors) ? cocktail.colors : [cocktail.colors];
    return { '--colors': colors.join(', ') } as React.CSSProperties;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>{cocktail.name}</h2>
        <div className={styles.badges}>
          {cocktail.iba && (
            <span className={`${styles.badge} ${styles.badgeIba}`}>IBA</span>
          )}
          {cocktail.category && (
            <span className={`${styles.badge} ${styles.badgeCategory}`}>
              {cocktail.category}
            </span>
          )}
          <span className={`${styles.badge} ${styles.badgeGlass}`}>
            {cocktail.glass}
          </span>
        </div>
      </div>

      <div className={styles.colorIndicator} style={getColorStyle()} />

      <div className={styles.ingredients}>
        <h3 className={styles.ingredientsTitle}>Ingredients</h3>
        <ul className={styles.ingredientsList}>
          {cocktail.ingredients
            .filter(ingredient => ingredient.ingredient) // Filter where ingredient.ingredient exists
            .map((ingredient, index) => (
              <li key={index} className={styles.ingredient}>
                <span className={styles.ingredientName}>
                  {getIngredientDisplay(ingredient)}
                </span>
                <span className={styles.ingredientAmount}>
                  {formatIngredientAmount(ingredient)}
                </span>
              </li>
            ))}
        </ul>
      </div>

      <div className={styles.preparation}>
        <h3 className={styles.preparationTitle}>Preparation</h3>
        <p className={styles.preparationText}>{cocktail.preparation}</p>
      </div>

      {cocktail.garnish && (
        <div className={styles.garnish}>
          <span className={styles.garnishIcon}>🍋</span>
          <span className={styles.garnishText}>Garnish: {cocktail.garnish}</span>
        </div>
      )}
    </div>
  );
}