import DOMPurify from "dompurify";

/**
 * useSanitize — Custom hook for XSS prevention (PRD §5)
 * Uses DOMPurify to clean free-text inputs targeting the
 * "Additional description" and "Task Name" fields.
 */
export function useSanitize() {
  /**
   * Sanitizes a string to remove XSS vectors.
   * @param dirty - raw user input string
   * @returns cleaned string safe for display and storage
   */
  const sanitize = (dirty: string): string => {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: [], // strip all HTML tags
      ALLOWED_ATTR: [], // strip all attributes
    }).trim();
  };

  /**
   * Sanitizes a record of string values (e.g. a form data object).
   * Only sanitizes the specified fields, leaving others untouched.
   */
  const sanitizeFields = <T extends Record<string, unknown>>(
    data: T,
    fields: (keyof T)[],
  ): T => {
    const result = { ...data };
    for (const field of fields) {
      if (typeof result[field] === "string") {
        (result[field] as unknown) = sanitize(result[field] as string);
      }
    }
    return result;
  };

  return { sanitize, sanitizeFields };
}
