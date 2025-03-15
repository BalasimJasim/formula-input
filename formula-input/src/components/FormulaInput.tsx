'use client';

import { useRef, useState, useEffect, KeyboardEvent } from 'react';
import { useFormulaStore, Tag } from '../store/formulaStore';
import { useVariables } from '../hooks/useVariables';
import FormulaTag from './FormulaTag';
import AutocompleteSuggestions from './AutocompleteSuggestions';
import { calculateFormula, isOperator, isNumber } from '../utils/formulaCalculator';

export default function FormulaInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [result, setResult] = useState<string | number>('');
  
  const {
    formula,
    searchTerm,
    selectedTagIndex,
    setCursorPosition,
    setSearchTerm,
    setSelectedTagIndex,
    addTag,
    removeTag,
    addOperator,
    addNumber,
    backspace,
    clear
  } = useFormulaStore();
  
  const { data: suggestions = [], isLoading } = useVariables(searchTerm);
  
  // Focus the input when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Calculate the result whenever the formula changes
  useEffect(() => {
    if (formula.length > 0) {
      const calculatedResult = calculateFormula(formula);
      setResult(calculatedResult);
    } else {
      setResult('');
    }
  }, [formula]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Always show suggestions when there's input
    setShowSuggestions(value.length > 0);
  };
  
  // Handle keyboard events
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && searchTerm === '') {
      e.preventDefault();
      backspace();
      return;
    }
    
    // Handle operators
    if (isOperator(e.key)) {
      e.preventDefault();
      addOperator(e.key);
      // Reset search term and hide suggestions after adding an operator
      setSearchTerm('');
      setShowSuggestions(false);
      return;
    }
    
    // Handle numbers
    if (isNumber(e.key) || e.key === '.') {
      if (searchTerm === '') {
        e.preventDefault();
        addNumber(e.key);
        return;
      }
    }
    
    // Handle enter to select the first suggestion
    if (e.key === 'Enter' && suggestions.length > 0 && showSuggestions) {
      e.preventDefault();
      handleSelectTag(suggestions[0]);
      return;
    }
    
    // Handle escape to close suggestions
    if (e.key === 'Escape') {
      e.preventDefault();
      setShowSuggestions(false);
      return;
    }

    // Show suggestions for any other key press if there's a search term
    if (searchTerm.length > 0 || e.key.length === 1) {
      setShowSuggestions(true);
    }
  };
  
  // Handle tag selection
  const handleSelectTag = (tag: Tag) => {
    addTag(tag);
    setSearchTerm('');
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Handle tag click
  const handleTagClick = (index: number) => {
    setSelectedTagIndex(index);
    setCursorPosition(index + 1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Handle tag removal
  const handleRemoveTag = (index: number) => {
    removeTag(index);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Force show suggestions
  const handleFocusInput = () => {
    setIsFocused(true);
    // Always check for suggestions when focused
    if (searchTerm.length > 0) {
      setShowSuggestions(true);
    }
  };
  
  // Handle blur with longer delay to ensure clicks on suggestions register
  const handleBlurInput = () => {
    // Use a longer timeout to ensure click events on suggestions can complete
    setTimeout(() => {
      setIsFocused(false);
      // Don't hide suggestions immediately to allow clicks to register
    }, 300);
  };
  
  // Explicitly handle clicks on the container to ensure focus
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      // Show suggestions if there's a search term
      if (searchTerm.length > 0) {
        setShowSuggestions(true);
      }
    }
  };
  
  // Render formula items
  const renderFormulaItems = () => {
    return formula.map((item, index) => {
      if (typeof item === 'string') {
        // Render operators and numbers
        return (
          <span key={`${item}-${index}`} className="mx-1 text-gray-700">
            {item}
          </span>
        );
      } else {
        // Render tags
        return (
          <FormulaTag
            key={`${item.id}-${index}`}
            tag={item}
            isSelected={selectedTagIndex === index}
            onClick={() => handleTagClick(index)}
            onRemove={() => handleRemoveTag(index)}
          />
        );
      }
    });
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-2 text-sm text-gray-500">
        Enter a formula using variables, operators (+, -, *, /, ^), and numbers
      </div>
      
      <div
        ref={containerRef}
        className={`
          relative flex flex-wrap items-center p-3 border rounded-md
          ${isFocused ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'}
          min-h-14 bg-white shadow-sm transition-all duration-200
        `}
        onClick={handleContainerClick}
      >
        {/* Render formula items */}
        {renderFormulaItems()}
        
        {/* Input for search and adding new items */}
        <input
          ref={inputRef}
          type="text"
          className="flex-grow outline-none px-2 py-1.5 text-base font-medium text-gray-800 placeholder-gray-500"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocusInput}
          onBlur={handleBlurInput}
          placeholder={formula.length === 0 ? "Start typing to search for variables..." : ""}
        />
        
        {/* Autocomplete suggestions */}
        <AutocompleteSuggestions
          suggestions={suggestions}
          isLoading={isLoading}
          onSelect={handleSelectTag}
          visible={showSuggestions && isFocused}
        />
      </div>
      
      {/* Result display */}
      {result && (
        <div className="mt-4 p-4 bg-white border border-gray-300 rounded-md shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">Result:</div>
          <div className="text-xl font-semibold text-blue-700">{result}</div>
        </div>
      )}
      
      {/* Clear button */}
      {formula.length > 0 && (
        <button
          type="button"
          onClick={clear}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
        >
          Clear
        </button>
      )}
    </div>
  );
} 