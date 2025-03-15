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
    <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Formula Input - Causal Clone</h2>
      
      <div className="mb-3 text-sm text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-100">
        <p className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Enter a formula using variables, operators (+, -, *, /, ^), and numbers
        </p>
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
      
      {/* Keyboard shortcuts help */}
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
        <span className="bg-gray-100 px-2 py-1 rounded">Enter: Select suggestion</span>
        <span className="bg-gray-100 px-2 py-1 rounded">Backspace: Delete last item</span>
        <span className="bg-gray-100 px-2 py-1 rounded">Esc: Close suggestions</span>
      </div>
      
      {/* Result display */}
      {result && (
        <div className="mt-5 p-4 bg-white border border-gray-300 rounded-md shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">Result:</div>
          <div className="text-xl font-semibold text-blue-700">{result}</div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="mt-5 flex gap-3">
        {formula.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Formula
          </button>
        )}
      </div>
    </div>
  );
} 