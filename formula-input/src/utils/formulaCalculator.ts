import { Tag } from '../store/formulaStore';

// Simple formula calculator
export const calculateFormula = (formula: (Tag | string)[]): number | string => {
  try {
    // Convert formula to a calculable expression
    const expression = formula.map(item => {
      if (typeof item === 'string') {
        // If it's an operator or number, use it directly
        return item;
      } else {
        // If it's a tag, use its value
        const value = item.value;
        
        // If the value is a string that looks like a formula, try to evaluate it
        if (typeof value === 'string' && /[+\-*/^()]/.test(value)) {
          try {
            // This is a simplistic approach - in a real app, you'd want to use a proper formula parser
            // eslint-disable-next-line no-eval
            return eval(value);
          } catch {
            return value;
          }
        }
        
        return value;
      }
    }).join(' ');
    
    // Evaluate the expression
    // Note: Using eval is generally not recommended for security reasons
    // In a production app, you'd want to use a proper formula parser/evaluator
    // eslint-disable-next-line no-eval
    const result = eval(expression);
    
    return result;
  } catch (error) {
    console.error('Error calculating formula:', error);
    return 'Error';
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