import { ArrowRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import "./FeatureCard.css";

interface FeatureCardProps {
  to: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  cta: string;
  accent: "blue" | "purple" | "green" | "yellow" | "red";
}

function FeatureCard({
  to,
  icon: Icon,
  title,
  desc,
  cta,
  accent,
}: FeatureCardProps) {
  const iconBgClass = `icon-bg-${accent}`;
  return (
    <Link to={to} className={`feature-card feature-card--${accent}`}>
      <div className="feature-card__head">
        <div className={`feature-card__icon-wrap ${iconBgClass}`}>
          <Icon size={22} strokeWidth={1.75} />
        </div>
      </div>
      <div className="feature-card__title">{title}</div>
      <div className="feature-card__desc">{desc}</div>
      <div className="feature-card__footer">
        <span className="feature-card__cta">
          {cta}
          <span className="feature-card__arrow">
            <ArrowRight size={14} strokeWidth={2.5} />
          </span>
        </span>
      </div>
    </Link>
  );
}

export default FeatureCard;
