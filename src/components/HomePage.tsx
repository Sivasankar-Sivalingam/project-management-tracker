import { Link } from 'react-router-dom';
import './HomePage.css';

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  delta?: string;
  colorVar?: string;
}

function StatCard({ icon, value, label, delta, colorVar = 'var(--accent-primary)' }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__value" style={{ color: colorVar }}>{value}</div>
      <div className="stat-card__label">{label}</div>
      {delta && <div className="stat-card__delta">↑ {delta}</div>}
    </div>
  );
}

interface FeatureCardProps {
  to: string;
  icon: string;
  usTag: string;
  title: string;
  desc: string;
  cta: string;
  accent: 'blue' | 'purple' | 'green' | 'yellow' | 'red';
}

function FeatureCard({ to, icon, usTag, title, desc, cta, accent }: FeatureCardProps) {
  const iconBgClass = `icon-bg-${accent}`;
  return (
    <Link to={to} className={`feature-card feature-card--${accent}`}>
      <div className="feature-card__head">
        <div className={`feature-card__icon-wrap ${iconBgClass}`}>{icon}</div>
        <span className="feature-card__us-tag">{usTag}</span>
      </div>
      <div className="feature-card__title">{title}</div>
      <div className="feature-card__desc">{desc}</div>
      <div className="feature-card__footer">
        <span className="feature-card__cta">
          {cta} <span className="feature-card__arrow">→</span>
        </span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ── */}
      <div className="home-hero">
        <div className="home-hero__eyebrow">🚀 Project Management Tracker</div>
        <h1 className="home-hero__title">
          Manage Your Team{' '}
          <span className="gradient-text">Smarter</span>
        </h1>
        <p className="home-hero__desc">
          A centralised hub to add team members, assign tasks, review allocations, and
          track multi-level approval workflows — all backed by a live mock API.
        </p>
        <div className="home-hero__actions">
          <div className="home-hero__pill">⚡ React + TypeScript</div>
          <div className="home-hero__pill">🏭 Factory Pattern</div>
          <div className="home-hero__pill">🔒 DOMPurify XSS Guard</div>
          <div className="home-hero__pill">🌐 JSON Server :3001</div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="home-stats">
        <StatCard
          icon="👥"
          value="—"
          label="Team Members"
          colorVar="var(--accent-primary)"
          delta="Live from API"
        />
        <StatCard
          icon="📋"
          value="—"
          label="Active Tasks"
          colorVar="var(--accent-secondary)"
          delta="Live from API"
        />
        <StatCard
          icon="📊"
          value="100%"
          label="Max Allocation"
          colorVar="var(--accent-success)"
        />
        <StatCard
          icon="🎓"
          value="4+"
          label="Min. Experience (yrs)"
          colorVar="var(--accent-warning)"
        />
      </div>

      {/* ── Feature Navigation Cards ── */}
      <div className="home-features-header">
        <h2>All Features</h2>
        <span>5 user stories · Click any card to get started</span>
      </div>

      <div className="home-features">
        <FeatureCard
          to="/add-member"
          icon="➕"
          usTag="US_01"
          accent="blue"
          title="Add Team Member"
          desc="Register a new team member with full profile validation: minimum 4 years experience, at least 3 skillsets, and valid project date ranges."
          cta="Add Member"
        />
        <FeatureCard
          to="/members"
          icon="👥"
          usTag="US_02"
          accent="purple"
          title="View All Members"
          desc="Fetch and display all team member profiles from the mock API, sorted in descending order of experience."
          cta="View Members"
        />
        <FeatureCard
          to="/assign-task"
          icon="✅"
          usTag="US_03"
          accent="green"
          title="Assign Task"
          desc="Create and assign tasks to team members. Custom TaskFactory validates date constraints and raises exceptions when task end exceeds project end."
          cta="Assign Task"
        />
        <FeatureCard
          to="/tasks"
          icon="📋"
          usTag="US_04"
          accent="yellow"
          title="View Tasks"
          desc="Search tasks by Member ID and review the full approval hierarchy — who has approved and who it's pending with at the next level."
          cta="View Tasks"
        />
        <FeatureCard
          to="/allocation"
          icon="📊"
          usTag="US_05"
          accent="red"
          title="Update Allocation"
          desc="Adjust team member allocation percentages with automatic business rules: expired projects are auto-set to 0%, active projects to 100%."
          cta="Update Allocation"
        />
      </div>
    </div>
  );
}
