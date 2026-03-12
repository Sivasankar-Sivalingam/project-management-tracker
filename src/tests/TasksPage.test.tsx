import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import TasksPage from "../pages/TasksPage/TasksPage";
import type { MemberData, Task } from "../types";

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

const mockTask: Task = {
  id: "t1",
  memberId: "EMP001",
  memberName: "Alice Smith",
  taskName: "Build Dashboard UI",
  deliverables: "Functional dashboard with charts",
  taskStartDate: "2024-02-01",
  taskEndDate: "2024-06-01",
  history: [
    { level: 1, approver: "Manager A", status: "Approved", date: "2024-02-10" },
    { level: 2, approver: "Director B", status: "Pending", date: null },
  ],
};

describe("TasksPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the page title", () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockMembers,
    } as Response);
    render(<TasksPage />);
    expect(screen.getByText("View Tasks")).toBeInTheDocument();
  });

  it("should render the member search input", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockMembers,
    } as Response);
    render(<TasksPage />);
    expect(
      screen.getByPlaceholderText(/search by member name or id/i),
    ).toBeInTheDocument();
  });

  it("should fetch members on mount", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockMembers,
    } as Response);
    render(<TasksPage />);
    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith("http://localhost:3001/members"),
    );
  });

  it("should show task loading state after member is selected", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockMembers,
      } as Response)
      .mockReturnValueOnce(new Promise(() => {})); // second call never resolves
    render(<TasksPage />);
    await waitFor(() => {});
    // Simulate selecting a member by typing and focusing
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Alice" } });
    fireEvent.focus(input);
    const suggestion = await screen.findByText("Alice Smith");
    fireEvent.mouseDown(suggestion);
    expect(await screen.findByText(/fetching task/i)).toBeInTheDocument();
  });

  it("should display task details after a member with a task is selected", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockMembers,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockTask],
      } as Response);
    render(<TasksPage />);
    await waitFor(() => {});
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Alice" } });
    fireEvent.focus(input);
    const suggestion = await screen.findByText("Alice Smith");
    fireEvent.mouseDown(suggestion);
    expect(await screen.findByText("Build Dashboard UI")).toBeInTheDocument();
    expect(
      screen.getByText("Functional dashboard with charts"),
    ).toBeInTheDocument();
  });

  it("should show 'No task assigned' when task list is empty for member", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockMembers,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);
    render(<TasksPage />);
    await waitFor(() => {});
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Alice" } });
    fireEvent.focus(input);
    const suggestion = await screen.findByText("Alice Smith");
    fireEvent.mouseDown(suggestion);
    expect(
      await screen.findByText(/no task assigned to Alice Smith/i),
    ).toBeInTheDocument();
  });

  it("should show error message when task fetch fails", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockMembers,
      } as Response)
      .mockRejectedValueOnce(new Error("Network error"));
    render(<TasksPage />);
    await waitFor(() => {});
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Alice" } });
    fireEvent.focus(input);
    const suggestion = await screen.findByText("Alice Smith");
    fireEvent.mouseDown(suggestion);
    expect(
      await screen.findByText(/could not fetch task data/i),
    ).toBeInTheDocument();
  });

  it("should display approval history table", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockMembers,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockTask],
      } as Response);
    render(<TasksPage />);
    await waitFor(() => {});
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Alice" } });
    fireEvent.focus(input);
    const suggestion = await screen.findByText("Alice Smith");
    fireEvent.mouseDown(suggestion);
    expect(await screen.findByText("Manager A")).toBeInTheDocument();
    expect(screen.getByText("Director B")).toBeInTheDocument();
    expect(screen.getAllByText("Approved").length).toBeGreaterThan(0);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("should show 'No approval history' when history is empty", async () => {
    const taskNoHistory = { ...mockTask, history: [] };
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockMembers,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [taskNoHistory],
      } as Response);
    render(<TasksPage />);
    await waitFor(() => {});
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Alice" } });
    fireEvent.focus(input);
    fireEvent.mouseDown(await screen.findByText("Alice Smith"));
    expect(
      await screen.findByText(/no approval history available/i),
    ).toBeInTheDocument();
  });

  it("should show error when task fetch response is not ok", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockMembers,
      } as Response)
      .mockResolvedValueOnce({ ok: false, json: async () => ({}) } as Response);
    render(<TasksPage />);
    await waitFor(() => {});
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Alice" } });
    fireEvent.focus(input);
    fireEvent.mouseDown(await screen.findByText("Alice Smith"));
    expect(
      await screen.findByText(/could not fetch task data/i),
    ).toBeInTheDocument();
  });

  it("should clear task when search input is changed", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockMembers,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockTask],
      } as Response);
    render(<TasksPage />);
    await waitFor(() => {});
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Alice" } });
    fireEvent.focus(input);
    fireEvent.mouseDown(await screen.findByText("Alice Smith"));
    await screen.findByText("Build Dashboard UI");
    fireEvent.change(input, { target: { value: "" } });
    expect(screen.queryByText("Build Dashboard UI")).not.toBeInTheDocument();
  });
});
