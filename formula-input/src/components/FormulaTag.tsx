'use client';

import { useState, useRef } from 'react';
import { Tag } from '../store/formulaStore';

interface FormulaTagProps {
  tag: Tag;
  isSelected: boolean;
  onClick: () => void;
  onRemove: () => void;
}

export default function FormulaTag({ tag, isSelected, onClick, onRemove }: FormulaTagProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div 
      className={`
        inline-flex items-center rounded-md px-3 py-1.5 mr-1.5 text-base font-medium
        ${isSelected ? 'bg-blue-100 border-blue-500 text-blue-800' : 'bg-gray-100 border-gray-300 text-gray-800'}
        border-2 cursor-pointer group relative hover:bg-opacity-90 transition-colors
      `}
      onClick={onClick}
    >
      <span className="mr-2">{tag.name}</span>
      
      {/* Dropdown toggle button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="ml-1 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </button>
      
      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div 
          ref={dropdownRef}
          className="absolute top-full right-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
              <span className="font-semibold">Category:</span> {tag.category}
            </div>
            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
              <span className="font-semibold">Value:</span> {tag.value}
            </div>
            <button
              type="button"
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
                setIsDropdownOpen(false);
              }}
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 