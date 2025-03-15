import { create } from 'zustand';

export interface Tag {
  id: string;
  name: string;
  category: string;
  value: string | number;
}

interface FormulaState {
  formula: (Tag | string)[];
  cursorPosition: number;
  isEditing: boolean;
  searchTerm: string;
  selectedTagIndex: number | null;
  
  // Actions
  setFormula: (formula: (Tag | string)[]) => void;
  setCursorPosition: (position: number) => void;
  setIsEditing: (isEditing: boolean) => void;
  setSearchTerm: (term: string) => void;
  setSelectedTagIndex: (index: number | null) => void;
  
  // Formula manipulation
  addTag: (tag: Tag) => void;
  removeTag: (index: number) => void;
  addOperator: (operator: string) => void;
  addNumber: (num: string) => void;
  backspace: () => void;
  clear: () => void;
}

export const useFormulaStore = create<FormulaState>((set) => ({
  formula: [],
  cursorPosition: 0,
  isEditing: false,
  searchTerm: '',
  selectedTagIndex: null,
  
  setFormula: (formula) => set({ formula }),
  setCursorPosition: (position) => set({ cursorPosition: position }),
  setIsEditing: (isEditing) => set({ isEditing }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedTagIndex: (index) => set({ selectedTagIndex: index }),
  
  addTag: (tag) => set((state) => {
    const newFormula = [...state.formula];
    newFormula.splice(state.cursorPosition, 0, tag);
    return { 
      formula: newFormula, 
      cursorPosition: state.cursorPosition + 1,
      searchTerm: ''
    };
  }),
  
  removeTag: (index) => set((state) => {
    const newFormula = [...state.formula];
    newFormula.splice(index, 1);
    return { 
      formula: newFormula,
      cursorPosition: Math.min(state.cursorPosition, newFormula.length)
    };
  }),
  
  addOperator: (operator) => set((state) => {
    const newFormula = [...state.formula];
    newFormula.splice(state.cursorPosition, 0, operator);
    return { 
      formula: newFormula, 
      cursorPosition: state.cursorPosition + 1 
    };
  }),
  
  addNumber: (num) => set((state) => {
    const newFormula = [...state.formula];
    
    // If the current position has a number, append to it
    if (
      state.cursorPosition > 0 && 
      typeof newFormula[state.cursorPosition - 1] === 'string' && 
      /^\d+(\.\d*)?$/.test(newFormula[state.cursorPosition - 1] as string)
    ) {
      newFormula[state.cursorPosition - 1] = (newFormula[state.cursorPosition - 1] as string) + num;
      return { formula: newFormula };
    }
    
    // Otherwise add a new number
    newFormula.splice(state.cursorPosition, 0, num);
    return { 
      formula: newFormula, 
      cursorPosition: state.cursorPosition + 1 
    };
  }),
  
  backspace: () => set((state) => {
    if (state.cursorPosition === 0) return state;
    
    const newFormula = [...state.formula];
    newFormula.splice(state.cursorPosition - 1, 1);
    
    return { 
      formula: newFormula, 
      cursorPosition: state.cursorPosition - 1 
    };
  }),
  
  clear: () => set({ 
    formula: [], 
    cursorPosition: 0,
    searchTerm: '',
    selectedTagIndex: null
  }),
})); 