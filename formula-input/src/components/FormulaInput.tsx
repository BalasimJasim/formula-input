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
  
  // Handle container click to focus the input
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
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
          relative flex flex-wrap items-center p-2 border rounded-md
          ${isFocused ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300'}
          min-h-12 bg-white
        `}
        onClick={handleContainerClick}
      >
        {/* Render formula items */}
        {renderFormulaItems()}
        
        {/* Input for search and adding new items */}
        <input
          ref={inputRef}
          type="text"
          className="flex-grow outline-none px-1 py-0.5 text-sm"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <div className="text-sm text-gray-500">Result:</div>
          <div className="text-lg font-medium">{result}</div>
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