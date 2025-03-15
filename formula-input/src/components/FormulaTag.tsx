'use client';

import { useState, useRef, useEffect } from 'react';
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
  const tagRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          tagRef.current && !tagRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div 
      ref={tagRef}
      className={`
        inline-flex items-center rounded-md px-3 py-1.5 mr-2 text-base font-medium
        ${isSelected 
          ? 'bg-blue-100 border-blue-500 text-blue-800 shadow-sm' 
          : 'bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-50'}
        border-2 cursor-pointer group relative transition-all duration-200
        ${isDropdownOpen ? 'ring-2 ring-blue-200' : ''}
      `}
      onClick={onClick}
    >
      <span className="mr-2 font-medium">{tag.name}</span>
      
      {/* Dropdown toggle button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className={`
          ml-1 p-1 rounded-full focus:outline-none transition-colors duration-200
          ${isDropdownOpen 
            ? 'bg-blue-100 text-blue-700' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}
        `}
        aria-label="Toggle dropdown"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-3.5 w-3.5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d={isDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
          />
        </svg>
      </button>
      
      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div 
          ref={dropdownRef}
          className="absolute top-full right-0 mt-1 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 border border-gray-200"
        >
          <div className="py-1 divide-y divide-gray-100" role="menu" aria-orientation="vertical">
            <div className="px-4 py-3 bg-gray-50 rounded-t-md">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Tag Details</p>
              <p className="text-sm font-medium text-gray-900">{tag.name}</p>
            </div>
            <div className="px-4 py-2 text-sm text-gray-700">
              <span className="font-semibold text-gray-900">Category:</span> {tag.category}
            </div>
            <div className="px-4 py-2 text-sm text-gray-700">
              <span className="font-semibold text-gray-900">Value:</span> {' '}
              <span className="bg-gray-100 px-2 py-1 rounded text-gray-800 font-medium">
                {typeof tag.value === 'number' || tag.value ? tag.value.toString() : 'No value'}
              </span>
            </div>
            <div className="px-4 py-2">
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                  setIsDropdownOpen(false);
                }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1.5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                  />
                </svg>
                Remove Tag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 