import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import AssignTaskPage from "../pages/AssignTaskPage/AssignTaskPage";
import type { MemberData } from "../types";

const mockMembers: MemberData[] = [
  {
    id: "1",
    memberName: "Alice Smith",
    memberId: "EMP001",
    memberExperience: 8,
    memberSkillset: ["React", "TypeScript"],
    memberDescription: "Senior dev",
    projectStartDate: "2024-01-01",
    projectEndDate: "2025-12-31",
    memberAllocationPercentage: 80,
  },
];

describe("AssignTaskPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockMembers,
    } as Response);
  });

  it("should render the page title", async () => {
    render(<AssignTaskPage />);
    expect(screen.getAllByText("Assign Task").length).toBeGreaterThan(0);
  });

  it("should render the member search field", () => {
    render(<AssignTaskPage />);
    expect(
      screen.getByPlaceholderText(/search by member name or id/i),
    ).toBeInTheDocument();
  });

  it("should have the Assign Task button disabled initially", () => {
    render(<AssignTaskPage />);
    expect(screen.getByRole("button", { name: /assign task/i })).toBeDisabled();
  });

  it("should fetch members on mount", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockMembers,
    } as Response);
    render(<AssignTaskPage />);
    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith("http://localhost:3001/members"),
    );
  });

  it("should show project end date hint when a member is selected", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockMembers,
    } as Response);
    render(<AssignTaskPage />);
    await waitFor(() => {});
    const input = screen.getByRole("textbox", { name: "" });
    fireEvent.change(input, { target: { value: "Alice" } });
    fireEvent.focus(input);
    const suggestion = await screen.findByText("Alice Smith");
    fireEvent.mouseDown(suggestion);
    expect(
      await screen.findByText(/member project ends on/i),
    ).toBeInTheDocument();
  });

  it("should auto-fill Member ID when member is selected", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockMembers,
    } as Response);
    render(<AssignTaskPage />);
    await waitFor(() => {});
    const input = screen.getByRole("textbox", { name: "" });
    fireEvent.change(input, { target: { value: "Alice" } });
    fireEvent.focus(input);
    fireEvent.mouseDown(await screen.findByText("Alice Smith"));
    const memberIdInput = screen.getByDisplayValue("EMP001");
    expect(memberIdInput).toBeInTheDocument();
  });

  it("should show validation error for missing task name on submit", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockMembers,
    } as Response);
    render(<AssignTaskPage />);
    const taskNameInput = screen.getByLabelText(/task name/i);
    await userEvent.click(taskNameInput);
    await userEvent.tab();
    expect(
      await screen.findByText(/task name is required/i),
    ).toBeInTheDocument();
  });

  it("should show validation error for missing deliverables", async () => {
    render(<AssignTaskPage />);
    const deliverables = screen.getByLabelText(/deliverables/i);
    await userEvent.click(deliverables);
    await userEvent.tab();
    expect(
      await screen.findByText(/deliverables are required/i),
    ).toBeInTheDocument();
  });

  it("should show validation error for missing task start date", async () => {
    render(<AssignTaskPage />);
    const startDate = screen.getByLabelText(/task start date/i);
    await userEvent.click(startDate);
    await userEvent.tab();
    expect(
      await screen.findByText(/task start date is required/i),
    ).toBeInTheDocument();
  });

  it("should show validation error when task end date is before start date", async () => {
    render(<AssignTaskPage />);
    fireEvent.change(screen.getByLabelText(/task start date/i), {
      target: { value: "2025-06-01" },
    });
    fireEvent.change(screen.getByLabelText(/task end date/i), {
      target: { value: "2024-01-01" },
    });
    fireEvent.blur(screen.getByLabelText(/task end date/i));
    expect(
      await screen.findByText(/end date must be after task start date/i),
    ).toBeInTheDocument();
  });

  it("should show validation error when task end date exceeds member project end date", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockMembers,
    } as Response);
    render(<AssignTaskPage />);
    await waitFor(() => {});
    // Select member
    const searchInput = screen.getByRole("textbox", { name: "" });
    fireEvent.change(searchInput, { target: { value: "Alice" } });
    fireEvent.focus(searchInput);
    fireEvent.mouseDown(await screen.findByText("Alice Smith"));
    // Set task dates where end exceeds project end (2025-12-31)
    fireEvent.change(screen.getByLabelText(/task start date/i), {
      target: { value: "2025-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/task end date/i), {
      target: { value: "2026-06-01" },
    });
    fireEvent.blur(screen.getByLabelText(/task end date/i));
    expect(
      await screen.findByText(/cannot exceed the member's project end date/i),
    ).toBeInTheDocument();
  });

  it("should call fetch POST with sanitized data on valid submission", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockMembers,
      } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response);
    render(<AssignTaskPage />);
    await waitFor(() => {});
    // Select member
    const searchInput = screen.getByRole("textbox", { name: "" });
    fireEvent.change(searchInput, { target: { value: "Alice" } });
    fireEvent.focus(searchInput);
    fireEvent.mouseDown(await screen.findByText("Alice Smith"));
    // Fill task form
    await userEvent.type(screen.getByLabelText(/task name/i), "Build UI");
    await userEvent.type(
      screen.getByLabelText(/deliverables/i),
      "Dashboard component",
    );
    fireEvent.change(screen.getByLabelText(/task start date/i), {
      target: { value: "2024-03-01" },
    });
    fireEvent.change(screen.getByLabelText(/task end date/i), {
      target: { value: "2024-06-01" },
    });
    const submitBtn = screen.getByRole("button", { name: /assign task/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    fireEvent.click(submitBtn);
    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith(
        "http://localhost:3001/tasks",
        expect.objectContaining({ method: "POST" }),
      ),
    );
  });

  it("should reset form and search input after successful submission", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockMembers,
      } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response);
    render(<AssignTaskPage />);
    await waitFor(() => {});
    const searchInput = screen.getByRole("textbox", { name: "" });
    fireEvent.change(searchInput, { target: { value: "Alice" } });
    fireEvent.focus(searchInput);
    fireEvent.mouseDown(await screen.findByText("Alice Smith"));
    await userEvent.type(screen.getByLabelText(/task name/i), "Build UI");
    await userEvent.type(screen.getByLabelText(/deliverables/i), "Dashboard");
    fireEvent.change(screen.getByLabelText(/task start date/i), {
      target: { value: "2024-03-01" },
    });
    fireEvent.change(screen.getByLabelText(/task end date/i), {
      target: { value: "2024-06-01" },
    });
    const submitBtn = screen.getByRole("button", { name: /assign task/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByLabelText(/task name/i)).toHaveValue("");
    });
  });

  it("should reset form when Reset button is clicked", async () => {
    render(<AssignTaskPage />);
    await userEvent.type(screen.getByLabelText(/task name/i), "My Task");
    fireEvent.click(screen.getByRole("button", { name: /reset/i }));
    await waitFor(() =>
      expect(screen.getByLabelText(/task name/i)).toHaveValue(""),
    );
  });
});
