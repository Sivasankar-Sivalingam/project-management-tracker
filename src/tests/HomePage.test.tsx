import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";

describe("HomePage", () => {
  const renderHomePage = () =>
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

  it("should render the page heading", () => {
    renderHomePage();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("should render 'Manage Your Team' in the title", () => {
    renderHomePage();
    expect(screen.getByText(/Manage Your Team/i)).toBeInTheDocument();
  });

  it("should render the 'Smarter' gradient text", () => {
    renderHomePage();
    expect(screen.getByText("Smarter")).toBeInTheDocument();
  });

  it("should render the description paragraph", () => {
    renderHomePage();
    expect(screen.getByText(/centralised hub/i)).toBeInTheDocument();
  });

  it("should render technology pills", () => {
    renderHomePage();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Bootstrap")).toBeInTheDocument();
  });

  it("should render the 'All Features' section heading", () => {
    renderHomePage();
    expect(
      screen.getByRole("heading", { name: /all features/i }),
    ).toBeInTheDocument();
  });

  it("should render all 5 feature cards", () => {
    renderHomePage();
    const links = screen.getAllByRole("link");
    expect(links.length).toBe(5);
  });

  it("should render feature card titles", () => {
    renderHomePage();
    expect(screen.getAllByText("Add Team Member").length).toBeGreaterThan(0);
    expect(screen.getAllByText("View All Members").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Assign Task").length).toBeGreaterThan(0);
    expect(screen.getAllByText("View Tasks").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Update Allocation").length).toBeGreaterThan(0);
  });

  it("should render 'Click any card to get started' label", () => {
    renderHomePage();
    expect(
      screen.getByText(/click any card to get started/i),
    ).toBeInTheDocument();
  });
});
