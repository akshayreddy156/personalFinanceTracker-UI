import { useState, useCallback } from "react";
import { type ValidationRule, validate } from "../utils/validation";

/**
 * Hook for managing form validation state
 */
export const useValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Validates a single field and updates error state
   */
  const validateField = useCallback(
    (
      fieldName: string,
      value: any,
      rules: ValidationRule[],
      displayName?: string
    ): boolean => {
      const result = validate(value, rules, displayName || fieldName);

      setErrors((prev) => {
        const newErrors = { ...prev };
        if (!result.isValid && result.error) {
          newErrors[fieldName] = result.error;
        } else {
          delete newErrors[fieldName];
        }
        return newErrors;
      });

      return result.isValid;
    },
    []
  );

  /**
   * Validates multiple fields at once
   */
  const validateFields = useCallback(
    (
      fields: Record<
        string,
        { value: any; rules: ValidationRule[]; displayName?: string }
      >
    ): boolean => {
      const newErrors: Record<string, string> = {};

      Object.entries(fields).forEach(
        ([fieldName, { value, rules, displayName }]) => {
          const result = validate(value, rules, displayName || fieldName);
          if (!result.isValid && result.error) {
            newErrors[fieldName] = result.error;
          }
        }
      );

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    []
  );

  /**
   * Clears error for a specific field
   */
  const clearError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Clears all errors
   */
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Checks if a field has an error
   */
  const hasError = useCallback(
    (fieldName: string): boolean => {
      return !!errors[fieldName];
    },
    [errors]
  );

  /**
   * Gets error message for a field
   */
  const getError = useCallback(
    (fieldName: string): string | undefined => {
      return errors[fieldName];
    },
    [errors]
  );

  return {
    errors,
    validateField,
    validateFields,
    clearError,
    clearAllErrors,
    hasError,
    getError,
  };
};
