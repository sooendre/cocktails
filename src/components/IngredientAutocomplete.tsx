'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './IngredientAutocomplete.module.css';
import { filterIngredientsByQuery } from '@/utils/cocktail-utils';

interface IngredientAutocompleteProps {
  ingredients: string[];
  selectedIngredients: string[];
  onSelectionChange: (ingredients: string[]) => void;
  placeholder?: string;
}

export default function IngredientAutocomplete({
  ingredients,
  selectedIngredients,
  onSelectionChange,
  placeholder = "Type to search ingredients..."
}: IngredientAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter ingredients based on query and exclude already selected ones
  const filteredIngredients = filterIngredientsByQuery(ingredients, query)
    .filter(ingredient =>
      ingredient && !selectedIngredients.some(selected =>
        selected.toLowerCase() === ingredient.toLowerCase()
      )
    );

  // Handle ingredient selection
  const handleIngredientSelect = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      onSelectionChange([...selectedIngredients, ingredient]);
    }
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  // Handle ingredient removal
  const handleIngredientRemove = (ingredient: string) => {
    onSelectionChange(selectedIngredients.filter(item => item !== ingredient));
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
    setSelectedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev < filteredIngredients.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && filteredIngredients[selectedIndex]) {
        handleIngredientSelect(filteredIngredients[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    } else if (e.key === 'Backspace' && query === '' && selectedIngredients.length > 0) {
      // Remove last ingredient when backspace is pressed with empty query
      handleIngredientRemove(selectedIngredients[selectedIngredients.length - 1]);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.inputContainer}>
        {selectedIngredients.map((ingredient, index) => (
          <span key={index} className={styles.tag}>
            {ingredient}
            <button
              type="button"
              className={styles.tagRemove}
              onClick={() => handleIngredientRemove(ingredient)}
              aria-label={`Remove ${ingredient}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(query.length > 0)}
          placeholder={selectedIngredients.length === 0 ? placeholder : ''}
        />
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {filteredIngredients.length > 0 ? (
            filteredIngredients.map((ingredient, index) => (
              <div
                key={ingredient}
                className={`${styles.dropdownItem} ${
                  index === selectedIndex ? styles.selected : ''
                }`}
                onClick={() => handleIngredientSelect(ingredient)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {ingredient}
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              No ingredients found matching &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}