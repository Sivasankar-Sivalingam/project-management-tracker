import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Users } from "lucide-react";
import FeatureCard from "../components/FeatureCard/FeatureCard";

const renderFeatureCard = (overrides = {}) => {
  const defaults = {
    to: "/members",
    icon: Users,
    title: "View Members",
    desc: "Fetch and display all team member profiles.",
    cta: "View Members",
    accent: "purple" as const,
    ...overrides,
  };
  return render(
    <MemoryRouter>
      <FeatureCard {...defaults} />
    </MemoryRouter>,
  );
};

describe("FeatureCard", () => {
  it("should render the title", () => {
    renderFeatureCard();
    expect(screen.getAllByText("View Members").length).toBeGreaterThan(0);
  });

  it("should render the description", () => {
    renderFeatureCard();
    expect(
      screen.getByText("Fetch and display all team member profiles."),
    ).toBeInTheDocument();
  });

  it("should render the CTA text", () => {
    renderFeatureCard();
    // CTA appears twice (title and cta), we find the one inside the footer
    expect(screen.getAllByText("View Members").length).toBeGreaterThan(0);
  });

  it("should render an anchor (Link) pointing to correct path", () => {
    renderFeatureCard({ to: "/members" });
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/members");
  });

  it("should apply accent class to card", () => {
    const { container } = renderFeatureCard({ accent: "blue" });
    expect(container.firstChild).toHaveClass("feature-card--blue");
  });

  it("should apply icon-bg accent class", () => {
    const { container } = renderFeatureCard({ accent: "green" });
    expect(container.querySelector(".icon-bg-green")).toBeInTheDocument();
  });

  it("renders all accent variants without crashing", () => {
    const accents = ["blue", "purple", "green", "yellow", "red"] as const;
    accents.forEach((accent) => {
      expect(() => renderFeatureCard({ accent })).not.toThrow();
    });
  });
});
