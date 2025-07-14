'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import IngredientAutocomplete from '@/components/IngredientAutocomplete';
import CocktailList from '@/components/CocktailList';
import { Cocktail } from '@/types/cocktail';
import { extractUniqueIngredients, findCocktailsByAnyIngredient } from '@/utils/cocktail-utils';

export default function Home() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [filteredCocktails, setFilteredCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cocktails data on component mount
  useEffect(() => {
    const loadCocktails = async () => {
      try {
        const response = await fetch('/static/cocktails.json');
        if (!response.ok) {
          throw new Error('Failed to load cocktails data');
        }
        const cocktailsData: Cocktail[] = await response.json();
        setCocktails(cocktailsData);
        setFilteredCocktails(cocktailsData);

        const uniqueIngredients = extractUniqueIngredients(cocktailsData);
        setIngredients(uniqueIngredients);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadCocktails();
  }, []);


  // Filter cocktails when selected ingredients change
  useEffect(() => {
    const filtered = findCocktailsByAnyIngredient(cocktails, selectedIngredients);
    setFilteredCocktails(filtered);
  }, [cocktails, selectedIngredients]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Cocktail Finder</h1>
        <p className={styles.subtitle}>
          Discover cocktails you can make with the ingredients you have.
          Search and select ingredients to find perfect cocktail recipes.
        </p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{cocktails.length}</span>
            <span className={styles.statLabel}>Cocktails</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{ingredients.length}</span>
            <span className={styles.statLabel}>Ingredients</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{filteredCocktails.length}</span>
            <span className={styles.statLabel}>Matches</span>
          </div>
        </div>
      </header>

      <section className={styles.searchSection}>
        <label className={styles.searchLabel}>
          Select your ingredients:
        </label>
        <IngredientAutocomplete
          ingredients={ingredients}
          selectedIngredients={selectedIngredients}
          onSelectionChange={setSelectedIngredients}
          placeholder="Type to search for ingredients..."
        />
      </section>

      <section className={styles.resultsSection}>
        <CocktailList
          cocktails={filteredCocktails}
          selectedIngredients={selectedIngredients}
        />
      </section>
    </div>
  );
}
