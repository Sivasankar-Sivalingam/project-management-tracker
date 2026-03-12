import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import AllocationPage from "../pages/AllocationPage/AllocationPage";
import type { MemberData } from "../types";

// Past date member (project expired)
const expiredMember: MemberData = {
  id: "1",
  memberName: "Alice Smith",
  memberId: "EMP001",
  memberExperience: 8,
  memberSkillset: ["React", "TypeScript"],
  memberDescription: "Senior dev",
  projectStartDate: "2020-01-01",
  projectEndDate: "2021-12-31", // definitely expired
  memberAllocationPercentage: 80,
};

// Active member (project not expired - use a far-future date)
const activeMember: MemberData = {
  id: "2",
  memberName: "Bob Jones",
  memberId: "EMP002",
  memberExperience: 5,
  memberSkillset: ["Python"],
  memberDescription: "Backend dev",
  projectStartDate: "2024-01-01",
  projectEndDate: "2099-12-31",
  memberAllocationPercentage: 60,
};

describe("AllocationPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the page title", () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [activeMember],
    } as Response);
    render(<AllocationPage />);
    expect(screen.getByText("Update Allocation")).toBeInTheDocument();
  });

  it("should render the member search input", () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [activeMember],
    } as Response);
    render(<AllocationPage />);
    expect(
      screen.getByPlaceholderText(/search by member name or id/i),
    ).toBeInTheDocument();
  });

  it("should fetch members on mount", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [activeMember],
    } as Response);
    render(<AllocationPage />);
    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith("http://localhost:3001/members"),
    );
  });

  it("should show allocation details panel when a member is selected", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [activeMember],
    } as Response);
    render(<AllocationPage />);
    await waitFor(() => {});
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Bob" } });
    fireEvent.focus(input);
    fireEvent.mouseDown(await screen.findByText("Bob Jones"));
    expect(await screen.findByText("Allocation Details")).toBeInTheDocument();
    expect(screen.getByText("EMP002")).toBeInTheDocument();
  });

  it("should pre-fill allocation input with 100 for active member", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [activeMember],
    } as Response);
    render(<AllocationPage />);
    await waitFor(() => {});
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Bob" } });
    fireEvent.focus(input);
    fireEvent.mouseDown(await screen.findByText("Bob Jones"));
    const allocInput = await screen.findByLabelText(/new allocation/i);
    expect(allocInput).toHaveValue(100);
  });

  it("should pre-fill allocation input with 0 for expired member", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [expiredMember],
    } as Response);
    render(<AllocationPage />);
    await waitFor(() => {});
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Alice" } });
    fireEvent.focus(input);
    fireEvent.mouseDown(await screen.findByText("Alice Smith"));
    const allocInput = await screen.findByLabelText(/new allocation/i);
    expect(allocInput).toHaveValue(0);
  });

  it("should show 'Already up to date' hint when allocation matches", async () => {
    // Bob has 60% allocation; pre-fill sets to 100 (active), so it won't match
    // Set active member with 100% allocation so it matches the pre-fill
    const memberWithHundred: MemberData = {
      ...activeMember,
      memberAllocationPercentage: 100,
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [memberWithHundred],
    } as Response);
    render(<AllocationPage />);
    await waitFor(() => {});
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Bob" } });
    fireEvent.focus(input);
    fireEvent.mouseDown(await screen.findByText("Bob Jones"));
    expect(
      await screen.findByText(/allocation is already up to date/i),
    ).toBeInTheDocument();
  });

  it("should show 0% warning when submitting with allocation=0 for expired", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [expiredMember],
    } as Response);
    render(<AllocationPage />);
    await waitFor(() => {});
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Alice" } });
    fireEvent.focus(input);
    fireEvent.mouseDown(await screen.findByText("Alice Smith"));
    await screen.findByText("Allocation Details");
    // Allocation for expired is pre-filled at 0 which is not same as 80 (current), so button enabled
    const updateBtn = screen.getByRole("button", {
      name: /update allocation/i,
    });
    await waitFor(() => expect(updateBtn).not.toBeDisabled());
    fireEvent.click(updateBtn);
    expect(
      await screen.findByText(/the project end date has passed/i),
    ).toBeInTheDocument();
  });

  it("should call PATCH API when user confirms 0% warning", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [expiredMember],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...expiredMember, memberAllocationPercentage: 0 }),
      } as Response);
    render(<AllocationPage />);
    await waitFor(() => {});
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Alice" } });
    fireEvent.focus(input);
    fireEvent.mouseDown(await screen.findByText("Alice Smith"));
    await screen.findByText("Allocation Details");
    const updateBtn = screen.getByRole("button", {
      name: /update allocation/i,
    });
    await waitFor(() => expect(updateBtn).not.toBeDisabled());
    fireEvent.click(updateBtn);
    // Click "Yes, set to 0%"
    const confirmBtn = await screen.findByText(/yes, set to 0%/i);
    fireEvent.click(confirmBtn);
    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith(
        `http://localhost:3001/members/1`,
        expect.objectContaining({ method: "PATCH" }),
      ),
    );
  });

  it("should call PATCH and show success message for normal update", async () => {
    const updatedMember = { ...activeMember, memberAllocationPercentage: 50 };
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [activeMember],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => updatedMember,
      } as Response);
    render(<AllocationPage />);
    await waitFor(() => {});
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Bob" } });
    fireEvent.focus(input);
    fireEvent.mouseDown(await screen.findByText("Bob Jones"));
    await screen.findByText("Allocation Details");
    const allocInput = screen.getByLabelText(/new allocation/i);
    fireEvent.change(allocInput, { target: { value: "50" } });
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /update allocation/i }),
      ).not.toBeDisabled(),
    );
    fireEvent.click(screen.getByRole("button", { name: /update allocation/i }));
    expect(
      await screen.findByText(/allocation updated to/i),
    ).toBeInTheDocument();
  });

  it("should show error message when PATCH request fails", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [expiredMember],
      } as Response)
      .mockRejectedValueOnce(new Error("Network error"));
    render(<AllocationPage />);
    await waitFor(() => {});
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Alice" } });
    fireEvent.focus(input);
    fireEvent.mouseDown(await screen.findByText("Alice Smith"));
    await screen.findByText("Allocation Details");
    const updateBtn = screen.getByRole("button", {
      name: /update allocation/i,
    });
    await waitFor(() => expect(updateBtn).not.toBeDisabled());
    fireEvent.click(updateBtn);
    const confirmBtn = await screen.findByText(/yes, set to 0%/i);
    fireEvent.click(confirmBtn);
    expect(
      await screen.findByText(/failed to update allocation/i),
    ).toBeInTheDocument();
  });

  it("should cancel warning when Cancel is clicked", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [expiredMember],
    } as Response);
    render(<AllocationPage />);
    await waitFor(() => {});
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Alice" } });
    fireEvent.focus(input);
    fireEvent.mouseDown(await screen.findByText("Alice Smith"));
    await screen.findByText("Allocation Details");
    const updateBtn = screen.getByRole("button", {
      name: /update allocation/i,
    });
    await waitFor(() => expect(updateBtn).not.toBeDisabled());
    fireEvent.click(updateBtn);
    await screen.findByText(/the project end date has passed/i);
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(
      screen.queryByText(/the project end date has passed/i),
    ).not.toBeInTheDocument();
  });

  it("should show validation error for allocation out of range", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [activeMember],
    } as Response);
    render(<AllocationPage />);
    await waitFor(() => {});
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Bob" } });
    fireEvent.focus(input);
    fireEvent.mouseDown(await screen.findByText("Bob Jones"));
    await screen.findByText("Allocation Details");
    const allocInput = screen.getByLabelText(/new allocation/i);
    fireEvent.change(allocInput, { target: { value: "0" } });
    fireEvent.blur(allocInput);
    expect(
      await screen.findByText(/allocation must be between 1% and 100%/i),
    ).toBeInTheDocument();
  });

  it("should clear selected member and reset state when search input changes", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [activeMember],
    } as Response);
    render(<AllocationPage />);
    await waitFor(() => {});
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Bob" } });
    fireEvent.focus(input);
    fireEvent.mouseDown(await screen.findByText("Bob Jones"));
    await screen.findByText("Allocation Details");
    // Change search to clear selection
    fireEvent.change(input, { target: { value: "" } });
    expect(screen.queryByText("Allocation Details")).not.toBeInTheDocument();
  });
});
