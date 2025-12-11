/**
 * Common validation utilities for form inputs
 */

export interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validation rule builders - functions that return validation rules
 */
export const ValidationRules = {
  /**
   * Validates minimum length for strings
   */
  minLength: (length: number): ValidationRule => ({
    validate: (value: string) => value.length >= length,
    message: ` must be at least ${length} characters`,
  }),

  /**
   * Validates maximum length for strings
   */
  maxLength: (length: number): ValidationRule => ({
    validate: (value: string) => value.length <= length,
    message: ` must be at most ${length} characters`,
  }),

  /**
   * Validates email format
   */
  email: (): ValidationRule => ({
    validate: (value: string) => {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      return emailRegex.test(value);
    },
    message: " must be in a valid email format",
  }),

  /**
   * Validates phone number (10 digits, optional country code)
   */
  phoneNumber: (): ValidationRule => ({
    validate: (value: string) => {
      const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
      return phoneRegex.test(value.replace(/[\s()-]/g, ""));
    },
    message: " must be a valid phone number",
  }),

  /**
   * Validates positive numbers
   */
  positive: (): ValidationRule => ({
    validate: (value: number) => value > 0,
    message: " must be a positive number",
  }),

  /**
   * Validates non-negative numbers (zero or positive)
   */
  nonNegative: (): ValidationRule => ({
    validate: (value: number) => value >= 0,
    message: " must be zero or positive",
  }),

  /**
   * Validates minimum value for numbers
   */
  minValue: (min: number): ValidationRule => ({
    validate: (value: number) => value >= min,
    message: `must be at least ${min}`,
  }),

  /**
   * Validates maximum value for numbers
   */
  maxValue: (max: number): ValidationRule => ({
    validate: (value: number) => value <= max,
    message: ` must be at most ${max}`,
  }),

  /**
   * Validates required field (not empty)
   */
  required: (): ValidationRule => ({
    validate: (value: any) => {
      if (typeof value === "string") return value.trim().length > 0;
      if (typeof value === "number") return !isNaN(value) && value !== 0;
      return value !== null && value !== undefined;
    },
    message: " is required",
  }),

  /**
   * Validates against a custom regex pattern
   */
  pattern: (regex: RegExp, message: string): ValidationRule => ({
    validate: (value: string) => regex.test(value),
    message,
  }),

  /**
   * Validates that value matches another value (e.g., password confirmation)
   */
  matches: (targetValue: any, fieldName: string): ValidationRule => ({
    validate: (value: any) => value === targetValue,
    message: `Must match ${fieldName}`,
  }),

  /**
   * Validates alphabetic characters only
   */
  alphaOnly: (): ValidationRule => ({
    validate: (value: string) => /^[a-zA-Z\s]+$/.test(value),
    message: "Only letters are allowed",
  }),

  /**
   * Validates alphanumeric characters only
   */
  alphanumeric: (): ValidationRule => ({
    validate: (value: string) => /^[a-zA-Z0-9]+$/.test(value),
    message: "Only letters and numbers are allowed",
  }),

  /**
   * Custom validation rule
   */
  custom: (
    validator: (value: any) => boolean,
    message: string
  ): ValidationRule => ({
    validate: validator,
    message,
  }),
};

/**
 * Validates a value against multiple validation rules
 * Returns the first error encountered, or null if valid
 */
export const validate = (
  value: any,
  rules: ValidationRule[],
  fieldName?: string
): ValidationResult => {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      let errorMessage = rule.message;

      // If fieldName is provided, prepend it to the error message
      if (fieldName) {
        errorMessage = `${fieldName} ${errorMessage}`;
      }

      return {
        isValid: false,
        error: errorMessage,
      };
    }
  }
  return { isValid: true };
};

/**
 * Validates multiple fields at once
 * Returns an object with field names as keys and error messages as values
 */
export const validateFields = (
  fields: Record<string, { value: any; rules: ValidationRule[] }>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.entries(fields).forEach(([fieldName, { value, rules }]) => {
    const result = validate(value, rules);
    if (!result.isValid && result.error) {
      errors[fieldName] = result.error;
    }
  });

  return errors;
};

/**
 * Pre-configured validation sets for common use cases
 */
export const CommonValidations = {
  email: [ValidationRules.required(), ValidationRules.email()],

  password: [
    ValidationRules.required(),
    ValidationRules.minLength(8),
    ValidationRules.pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      " must contain uppercase, lowercase, and number"
    ),
  ],

  simplePassword: [ValidationRules.required(), ValidationRules.minLength(6)],

  name: [
    ValidationRules.required(),
    ValidationRules.minLength(2),
    ValidationRules.maxLength(50),
    ValidationRules.pattern(/^[A-Za-z ]+$/, " must contain only alphabets"),
  ],

  simpleName: [
    ValidationRules.required(),
    ValidationRules.minLength(2),
    ValidationRules.maxLength(50),
  ],

  phoneNumber: [ValidationRules.required(), ValidationRules.phoneNumber()],

  positiveAmount: [ValidationRules.required(), ValidationRules.positive()],

  nonNegativeAmount: [
    ValidationRules.required(),
    ValidationRules.nonNegative(),
  ],
};
