import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MemberSearch from "../components/MemberSearch/MemberSearch";
import type { MemberData } from "../types";

const mockMembers: MemberData[] = [
  {
    id: "1",
    memberName: "Alice Smith",
    memberId: "EMP001",
    memberExperience: 6,
    memberSkillset: ["React", "TypeScript", "Node"],
    memberDescription: "Senior developer",
    projectStartDate: "2024-01-01",
    projectEndDate: "2025-12-31",
    memberAllocationPercentage: 80,
  },
  {
    id: "2",
    memberName: "Bob Jones",
    memberId: "EMP002",
    memberExperience: 5,
    memberSkillset: ["Python", "Django", "SQL"],
    memberDescription: "Backend developer",
    projectStartDate: "2024-02-01",
    projectEndDate: "2025-11-30",
    memberAllocationPercentage: 60,
  },
];

const renderMemberSearch = (overrides = {}) => {
  const defaults = {
    members: mockMembers,
    value: "",
    onChange: vi.fn(),
    onSelect: vi.fn(),
    ...overrides,
  };
  return render(<MemberSearch {...defaults} />);
};

describe("MemberSearch", () => {
  it("should render the search input", () => {
    renderMemberSearch();
    expect(
      screen.getByPlaceholderText("Search by member name or ID…"),
    ).toBeInTheDocument();
  });

  it("should use custom placeholder when provided", () => {
    renderMemberSearch({ placeholder: "Find a member…" });
    expect(screen.getByPlaceholderText("Find a member…")).toBeInTheDocument();
  });

  it("should call onChange when user types in input", async () => {
    const onChange = vi.fn();
    renderMemberSearch({ onChange });
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Alice");
    expect(onChange).toHaveBeenCalled();
  });

  it("should show suggestions when value matches member name", async () => {
    renderMemberSearch({ value: "Alice" });
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    expect(await screen.findByText("Alice Smith")).toBeInTheDocument();
  });

  it("should show suggestions when value matches member ID", async () => {
    renderMemberSearch({ value: "EMP002" });
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    expect(await screen.findByText("Bob Jones")).toBeInTheDocument();
  });

  it("should show 'No members match' when no results found", async () => {
    renderMemberSearch({ value: "zzz-no-match" });
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    expect(
      await screen.findByText("No members match your search."),
    ).toBeInTheDocument();
  });

  it("should not show suggestions when value is empty", () => {
    renderMemberSearch({ value: "" });
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("should call onSelect with correct member when suggestion clicked", async () => {
    const onSelect = vi.fn();
    renderMemberSearch({ value: "Alice", onSelect });
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    const suggestion = await screen.findByText("Alice Smith");
    fireEvent.mouseDown(suggestion);
    expect(onSelect).toHaveBeenCalledWith(mockMembers[0]);
  });

  it("should apply is-invalid class when isInvalid is true", () => {
    const { container } = renderMemberSearch({ isInvalid: true });
    expect(container.querySelector(".is-invalid")).toBeInTheDocument();
  });

  it("should not apply is-invalid class by default", () => {
    const { container } = renderMemberSearch();
    expect(container.querySelector(".is-invalid")).not.toBeInTheDocument();
  });

  it("should hide suggestions when clicking outside", async () => {
    renderMemberSearch({ value: "Alice" });
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    expect(await screen.findByText("Alice Smith")).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("should accept an optional id prop", () => {
    renderMemberSearch({ id: "testSearchInput" });
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "id",
      "testSearchInput",
    );
  });
});
