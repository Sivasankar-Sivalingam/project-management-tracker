import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import MembersPage from "../pages/MembersPage/MembersPage";

const mockMembers = [
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
  {
    id: "2",
    memberName: "Bob Jones",
    memberId: "EMP002",
    memberExperience: 5,
    memberSkillset: ["Python", "Django"],
    memberDescription: "Backend dev",
    projectStartDate: "2024-02-01",
    projectEndDate: "2025-11-30",
    memberAllocationPercentage: 60,
  },
];

describe("MembersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state initially", () => {
    vi.spyOn(globalThis, "fetch").mockReturnValue(new Promise(() => {}));
    render(<MembersPage />);
    expect(screen.getByText(/fetching team members/i)).toBeInTheDocument();
  });

  it("should render members table after successful fetch", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockMembers,
    } as Response);
    render(<MembersPage />);
    expect(await screen.findByText("Alice Smith")).toBeInTheDocument();
    expect(await screen.findByText("Bob Jones")).toBeInTheDocument();
  });

  it("should show error message when fetch fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(
      new Error("Network error"),
    );
    render(<MembersPage />);
    expect(
      await screen.findByText(/could not fetch members/i),
    ).toBeInTheDocument();
  });

  it("should show error when response is not ok", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);
    render(<MembersPage />);
    expect(
      await screen.findByText(/could not fetch members/i),
    ).toBeInTheDocument();
  });

  it("should render member skills as pills", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockMembers,
    } as Response);
    render(<MembersPage />);
    expect(await screen.findByText("React")).toBeInTheDocument();
    expect(await screen.findByText("TypeScript")).toBeInTheDocument();
  });

  it("should render allocation percentage with % sign", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockMembers,
    } as Response);
    render(<MembersPage />);
    expect(await screen.findByText("80%")).toBeInTheDocument();
  });

  it("should sort members by experience descending by default", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockMembers,
    } as Response);
    render(<MembersPage />);
    await screen.findByText("Alice Smith");
    const rows = screen.getAllByRole("row");
    // First row is header, second is first member (Alice with 8 yrs, higher)
    expect(rows[1]).toHaveTextContent("Alice Smith");
  });

  it("should toggle sort direction when Experience column is clicked", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockMembers,
    } as Response);
    render(<MembersPage />);
    await screen.findByText("Alice Smith");
    const expHeader = screen.getByText("Experience").closest("th")!;
    fireEvent.click(expHeader);
    const rows = screen.getAllByRole("row");
    // After toggle (ascending), Bob (5 yrs) should be first
    expect(rows[1]).toHaveTextContent("Bob Jones");
  });

  it("should refetch members when Refresh button is clicked", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockMembers,
    } as Response);
    render(<MembersPage />);
    await screen.findByText("Alice Smith");
    const refreshBtn = screen.getByRole("button", { name: /refresh/i });
    fireEvent.click(refreshBtn);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(2));
  });

  it("should have a Retry button in error state that refetches", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockMembers,
      } as Response);
    render(<MembersPage />);
    const retryBtn = await screen.findByRole("button", { name: /retry/i });
    fireEvent.click(retryBtn);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(2));
  });

  it("should display formatted dates in the table", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockMembers,
    } as Response);
    render(<MembersPage />);
    await screen.findByText("Alice Smith");
    // Date "2024-01-01" should be formatted as "01 Jan 2024"
    expect(screen.getByText("01 Jan 2024")).toBeInTheDocument();
  });

  it("should show dash when description is empty string", async () => {
    const membersWithNoDesc = [{ ...mockMembers[0], memberDescription: "" }];
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => membersWithNoDesc,
    } as Response);
    render(<MembersPage />);
    await screen.findByText("Alice Smith");
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
