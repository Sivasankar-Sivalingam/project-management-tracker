import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FolderKanban,
  Users,
  UserPlus,
  ClipboardList,
  CheckSquare,
  PieChart,
  Menu,
  X,
} from "lucide-react";
import "./AppLayout.css";
import type { ReactNode } from "react";

const navLinks = [
  { to: "/members", label: "Members", icon: Users },
  { to: "/add-member", label: "Add Member", icon: UserPlus },
  { to: "/tasks", label: "Tasks", icon: ClipboardList },
  { to: "/assign-task", label: "Assign Task", icon: CheckSquare },
  { to: "/allocation", label: "Update Allocation", icon: PieChart },
] as const;

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="pmt-navbar">
      {/* Brand */}
      <div className="pmt-navbar__brand">
        <FolderKanban size={22} className="pmt-navbar__logo-icon" />
        <NavLink to="/" className="pmt-navbar__title" onClick={closeMenu}>
          PM Tracker
        </NavLink>
      </div>

      <div className="pmt-navbar__spacer" />

      {/* Desktop nav */}
      <nav className="pmt-navbar__meta pmt-navbar__meta--desktop">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className="pmt-navbar__link">
            <Icon size={15} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Hamburger button (mobile only) */}
      <button
        className="pmt-navbar__hamburger"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav className="pmt-mobile-menu">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className="pmt-mobile-menu__link"
              onClick={closeMenu}
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="pmt-shell">
        <main className="pmt-content">{children}</main>
      </div>
    </>
  );
}
