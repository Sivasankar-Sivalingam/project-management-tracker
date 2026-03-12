import { renderHook } from "@testing-library/react";
import { useSanitize } from "../hooks/useSanitize";

describe("useSanitize", () => {
  describe("sanitize", () => {
    it("should return a plain text string unchanged", () => {
      const { result } = renderHook(() => useSanitize());
      expect(result.current.sanitize("Hello World")).toBe("Hello World");
    });

    it("should strip HTML tags", () => {
      const { result } = renderHook(() => useSanitize());
      expect(result.current.sanitize("<b>Bold</b>")).toBe("Bold");
    });

    it("should strip script tags and XSS vectors", () => {
      const { result } = renderHook(() => useSanitize());
      expect(result.current.sanitize('<script>alert("xss")</script>')).toBe("");
    });

    it("should trim surrounding whitespace", () => {
      const { result } = renderHook(() => useSanitize());
      expect(result.current.sanitize("  hello  ")).toBe("hello");
    });

    it("should return empty string for empty input", () => {
      const { result } = renderHook(() => useSanitize());
      expect(result.current.sanitize("")).toBe("");
    });

    it("should strip anchor tags with href", () => {
      const { result } = renderHook(() => useSanitize());
      expect(
        result.current.sanitize('<a href="http://evil.com">click</a>'),
      ).toBe("click");
    });
  });

  describe("sanitizeFields", () => {
    it("should sanitize only specified string fields", () => {
      const { result } = renderHook(() => useSanitize());
      const data = {
        taskName: "<b>Task</b>",
        deliverables: "<script>bad</script>deliverable",
        memberId: "M001",
      };
      const sanitized = result.current.sanitizeFields(data, [
        "taskName",
        "deliverables",
      ]);
      expect(sanitized.taskName).toBe("Task");
      expect(sanitized.deliverables).toBe("deliverable");
      expect(sanitized.memberId).toBe("M001"); // untouched
    });

    it("should not mutate the original data object", () => {
      const { result } = renderHook(() => useSanitize());
      const data = { taskName: "<b>Task</b>", count: 5 };
      const sanitized = result.current.sanitizeFields(data, ["taskName"]);
      expect(data.taskName).toBe("<b>Task</b>"); // original unchanged
      expect(sanitized.taskName).toBe("Task");
    });

    it("should skip non-string fields", () => {
      const { result } = renderHook(() => useSanitize());
      const data = { value: 42 };
      const sanitized = result.current.sanitizeFields(data, ["value"]);
      expect(sanitized.value).toBe(42); // numbers left alone
    });

    it("should return all fields when no fields are specified", () => {
      const { result } = renderHook(() => useSanitize());
      const data = { taskName: "<b>Task</b>", memberId: "M001" };
      const sanitized = result.current.sanitizeFields(data, []);
      expect(sanitized).toEqual(data);
    });
  });
});
