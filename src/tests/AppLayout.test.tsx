import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppLayout from "../components/AppLayout/AppLayout";

describe("AppLayout", () => {
  const renderAppLayout = (children = <div>Page Content</div>) =>
    render(
      <MemoryRouter>
        <AppLayout>{children}</AppLayout>
      </MemoryRouter>,
    );

  it("should render the brand title", () => {
    renderAppLayout();
    expect(screen.getByText("PM Tracker")).toBeInTheDocument();
  });

  it("should render desktop nav links", () => {
    renderAppLayout();
    expect(screen.getAllByText(/^Members$/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^Add Member$/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^Tasks$/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^Assign Task$/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^Update Allocation$/).length).toBeGreaterThan(
      0,
    );
  });

  it("should render children content", () => {
    renderAppLayout(<div>Test Children</div>);
    expect(screen.getByText("Test Children")).toBeInTheDocument();
  });

  it("should render the hamburger menu button", () => {
    renderAppLayout();
    const btn = screen.getByLabelText("Open menu");
    expect(btn).toBeInTheDocument();
  });

  it("should open mobile menu when hamburger is clicked", () => {
    renderAppLayout();
    const hamburger = screen.getByLabelText("Open menu");
    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute("aria-label", "Close menu");
    expect(hamburger).toHaveAttribute("aria-expanded", "true");
  });

  it("should show mobile nav links when menu is open", () => {
    renderAppLayout();
    const hamburger = screen.getByLabelText("Open menu");
    fireEvent.click(hamburger);
    // Mobile drawer appears, so now there should be multiple "Members" links
    const memberLinks = screen.getAllByText("Members");
    expect(memberLinks.length).toBeGreaterThan(1);
  });

  it("should close mobile menu when a mobile link is clicked", () => {
    renderAppLayout();
    const hamburger = screen.getByLabelText("Open menu");
    fireEvent.click(hamburger);
    // Click a mobile menu link (last "Members" = mobile one)
    const memberLinks = screen.getAllByText("Members");
    fireEvent.click(memberLinks[memberLinks.length - 1]);
    expect(hamburger).toHaveAttribute("aria-label", "Open menu");
    expect(hamburger).toHaveAttribute("aria-expanded", "false");
  });

  it("should have PM Tracker link pointing to '/'", () => {
    renderAppLayout();
    const brandLink = screen.getByRole("link", { name: /pm tracker/i });
    expect(brandLink).toHaveAttribute("href", "/");
  });

  it("should toggle hamburger label when menu opens and closes", () => {
    renderAppLayout();
    const hamburger = screen.getByLabelText("Open menu");
    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute("aria-label", "Close menu");
    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute("aria-label", "Open menu");
  });
});
