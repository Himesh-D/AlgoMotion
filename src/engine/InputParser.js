export class InputParser {
  /**
   * Parses and validates array input
   * @param {string} input - Comma-separated string
   * @param {string} dataType - 'array' or 'string'
   * @returns {Array} - Parsed array of numbers or characters
   */
  static parseArray(input, dataType) {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      throw new Error("Input is empty. Please provide some data.");
    }

    if (dataType === 'string') {
      return trimmedInput.split('');
    }

    // Array mode: expect comma separated values
    const parts = trimmedInput.split(',').filter(p => p.trim() !== '');
    
    return parts.map((item, index) => {
      const trimmed = item.trim();
      
      // Handle quoted strings in array if needed
      if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
          (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
        return trimmed.slice(1, -1);
      }

      const num = Number(trimmed);
      if (isNaN(num)) {
        throw new Error(`Invalid numeric value at position ${index + 1}: "${trimmed}"`);
      }
      return num;
    });
  }

  /**
   * Parses parameters JSON
   * @param {string} paramsStr 
   * @returns {Object}
   */
  static parseParams(paramsStr) {
    if (!paramsStr || !paramsStr.trim()) return {};
    try {
      return JSON.parse(paramsStr);
    } catch (e) {
      throw new Error("Invalid parameters JSON. Please check your syntax.");
    }
  }

  /**
   * Basic validation for algorithm code
   * @param {string} code 
   */
  static validateCode(code) {
    if (!code || !code.trim()) {
      throw new Error("Algorithm code cannot be empty.");
    }
    // We could add more checks here (e.g. forbidden keywords if sandbox-lite is needed)
    return true;
  }
}
