'use client';

import { useEffect, useRef } from 'react';
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

  // Scroll to top when suggestions change
  useEffect(() => {
    if (suggestionsRef.current) {
      suggestionsRef.current.scrollTop = 0;
    }
  }, [suggestions]);

  if (!visible) return null;

  return (
    <div 
      ref={suggestionsRef}
      className="absolute top-full left-0 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg z-10"
    >
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">Loading...</div>
      ) : suggestions.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No suggestions found</div>
      ) : (
        <ul className="py-1">
          {suggestions.map((tag) => (
            <li 
              key={tag.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => onSelect(tag)}
            >
              <div className="flex-1">
                <div className="font-medium">{tag.name}</div>
                <div className="text-xs text-gray-500">{tag.category}</div>
              </div>
              <div className="text-sm text-gray-600">
                {typeof tag.value === 'number' || tag.value ? tag.value.toString() : 'No value'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 