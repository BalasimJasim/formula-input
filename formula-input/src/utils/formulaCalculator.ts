import { Tag } from '../store/formulaStore';

// Simple formula calculator
export const calculateFormula = (formula: (Tag | string)[]): number | string => {
  if (formula.length === 0) {
    return '';
  }
  
  // Check if the formula is just a list of operators in parentheses
  if (formula.length === 1 && typeof formula[0] === 'string') {
    const input = formula[0] as string;
    if (input.includes('(+, -, *, /, ^),') || input.match(/^\([\+\-\*\/\^\,\s]+\).*$/)) {
      return input; // Return the input as is, don't try to evaluate it
    }
  }
  
  try {
    // Convert formula to a calculable expression
    let expression = '';
    
    formula.forEach((item) => {
      if (typeof item === 'string') {
        // If it's an operator or number, use it directly
        // Skip commas as they're not valid in JavaScript expressions
        if (item.trim() === ',') {
          // Skip comma
        } else {
          expression += item;
        }
      } else {
        // If it's a tag, use its value
        const value = item.value;
        
        // If the value is a string that looks like a formula, try to evaluate it
        if (typeof value === 'string' && /[+\-*/^()]/.test(value)) {
          try {
            // This is a simplistic approach - in a real app, you'd want to use a proper formula parser
            const safeValue = value.replace(/\^/g, '**');
            // eslint-disable-next-line no-eval
            expression += String(eval(safeValue));
          } catch {
            expression += String(value);
          }
        } else {
          expression += String(value);
        }
      }
    });
    
    // Handle the ^ operator (convert to **)
    expression = expression.replace(/\^/g, '**');
    
    // Remove any commas from the expression as they're not valid in JavaScript expressions
    expression = expression.replace(/,/g, '');
    
    // Check if the expression is empty or just operators
    if (!expression || expression.trim() === '') {
      return '';
    }
    
    // Check if the expression contains only operators and parentheses
    if (/^[\+\-\*\/\(\)\s\*\*]+$/.test(expression)) {
      return formula.map(item => typeof item === 'string' ? item : String(item.value)).join('');
    }
    
    // Wrap the expression in a Function to evaluate it safely
    // This is safer than direct eval and handles more edge cases
    try {
      // Make sure the expression is valid before evaluating
      if (!/^[0-9\+\-\*\/\(\)\s\.\*\*]+$/.test(expression)) {
        return formula.map(item => typeof item === 'string' ? item : String(item.value)).join('');
      }
      
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict"; return (' + expression + ')')();
      
      // Handle NaN, Infinity, etc.
      if (typeof result === 'number' && !isFinite(result)) {
        return 'Invalid result';
      }
      
      return result;
    } catch {
      // If evaluation fails, just return the formula as a string
      return formula.map(item => typeof item === 'string' ? item : String(item.value)).join('');
    }
  } catch {
    // If all else fails, just return the formula as a string
    return formula.map(item => typeof item === 'string' ? item : String(item.value)).join('');
  }
};

// Check if a character is an operator
export const isOperator = (char: string): boolean => {
  return ['+', '-', '*', '/', '(', ')', '^'].includes(char);
};

// Check if a string is a number
export const isNumber = (str: string): boolean => {
  return /^\d+(\.\d*)?$/.test(str);
}; 