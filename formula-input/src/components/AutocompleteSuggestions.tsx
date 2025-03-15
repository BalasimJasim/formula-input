'use client';

import { useEffect, useRef, useState } from 'react';
import { Tag } from '../store/formulaStore';

interface AutocompleteSuggestionsProps {
  suggestions: Tag[];
  isLoading: boolean;
  onSelect: (tag: Tag) => void;
  visible: boolean;
}

export default function AutocompleteSuggestions({
  suggestions,
  isLoading,
  onSelect,
  visible
}: AutocompleteSuggestionsProps) {
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Scroll to top when suggestions change
  useEffect(() => {
    if (suggestionsRef.current) {
      suggestionsRef.current.scrollTop = 0;
    }
    setHoveredIndex(null);
  }, [suggestions]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        // This will be handled by the parent component
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!visible) return null;

  // Handle suggestion selection with both click and mouse events
  const handleSelectSuggestion = (tag: Tag, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(tag);
  };

  return (
    <div 
      ref={suggestionsRef}
      className="absolute top-full left-0 w-full mt-1 max-h-72 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg z-50"
      style={{ minWidth: '250px' }}
    >
      {isLoading ? (
        <div className="p-4 text-center text-gray-700 font-medium">Loading...</div>
      ) : suggestions.length === 0 ? (
        <div className="p-4 text-center text-gray-700 font-medium">No suggestions found</div>
      ) : (
        <ul className="py-2">
          {suggestions.map((tag, index) => (
            <li 
              key={tag.id}
              className={`
                px-4 py-3 cursor-pointer flex items-center border-b border-gray-100 last:border-b-0
                ${hoveredIndex === index ? 'bg-blue-100' : 'hover:bg-blue-50'}
                transition-colors duration-150
              `}
              onClick={(e) => handleSelectSuggestion(tag, e)}
              onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-base">{tag.name}</div>
                <div className="text-sm text-gray-600">{tag.category}</div>
              </div>
              <div className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded ml-2">
                {typeof tag.value === 'number' || tag.value ? tag.value.toString() : 'No value'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 