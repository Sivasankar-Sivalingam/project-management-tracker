import "./HomePage.css";
import FeatureCard from "../../components/FeatureCard/FeatureCard";
import FEATURE_CARDS from "../../mockData/featureCardData";
import { Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      <div className="home-hero">
        <div className="home-hero__eyebrow">
          <Zap size={13} strokeWidth={2.5} />
          Project Management Tracker
        </div>
        <h1 className="home-hero__title">
          Manage Your Team <span className="gradient-text">Smarter</span>
        </h1>
        <p className="home-hero__desc">
          A centralised hub to add team members, assign tasks, review
          allocations, and track multi-level approval workflows.
        </p>
        <div className="home-hero__actions">
          <div className="home-hero__pill">React</div>
          <div className="home-hero__pill">TypeScript</div>
          <div className="home-hero__pill">Bootstrap</div>
        </div>
      </div>

      <div className="home-features-header">
        <h2>All Features</h2>
        <span>Click any card to get started</span>
      </div>

      <div className="home-features">
        {FEATURE_CARDS.map((card) => (
          <FeatureCard key={card.to} {...card} />
        ))}
      </div>
    </div>
  );
}
