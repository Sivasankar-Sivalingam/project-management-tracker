import { useEffect, useState, useMemo } from "react";
import {
  Users,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import type { MemberData } from "../../types";
import "./MembersPage.css";

function formatDate(iso: string) {
  if (!iso) return "—";
  const date = new Date(iso);
  return isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

type SortDir = "asc" | "desc";

export default function MembersPage() {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3001/members");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMembers(await res.json());
    } catch {
      setError("Could not fetch members. Is the mock server running on :3001?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const displayed = useMemo(
    () =>
      [...members].sort((a, b) =>
        sortDir === "desc"
          ? b.memberExperience - a.memberExperience
          : a.memberExperience - b.memberExperience,
      ),
    [members, sortDir],
  );

  return (
    <div className="page-container">
      {/* ── Page header ── */}
      <div className="page-header">
        <div className="page-header__icon-wrap icon-bg-purple">
          <Users size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="page-header__title">Team Members</h2>
          <p className="page-header__subtitle">
            Profile details of all team members.
          </p>
        </div>
        <button
          className="refresh-btn"
          onClick={fetchMembers}
          disabled={loading}
          title="Refresh members"
        >
          <RefreshCw size={15} className={loading ? "spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="members-error">
          <AlertCircle size={16} />
          {error}
          <button className="retry-btn" onClick={fetchMembers}>
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      )}

      {/* ── Table ── */}
      <div className="members-table-card">
        {loading ? (
          <div className="members-loading">
            <div className="spinner" /> Fetching team members…
          </div>
        ) : (
          <table className="members-table" aria-label="Team members">
            <thead>
              <tr>
                <th>#</th>
                <th>Member ID</th>
                <th>Name</th>
                <th
                  className="th-sortable th-active"
                  onClick={() =>
                    setSortDir((direction) =>
                      direction === "desc" ? "asc" : "desc",
                    )
                  }
                  aria-sort={sortDir === "desc" ? "descending" : "ascending"}
                >
                  Experience
                  {sortDir === "desc" ? (
                    <ChevronDown size={13} className="th-sort-icon" />
                  ) : (
                    <ChevronUp size={13} className="th-sort-icon" />
                  )}
                </th>
                <th>Skillsets</th>
                <th>Description</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Allocation %</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((member, index) => (
                <tr key={member.id}>
                  <td className="cell-index">{index + 1}</td>
                  <td className="cell-id">{member.memberId}</td>
                  <td className="cell-name">{member.memberName}</td>
                  <td>
                    <span className="exp-badge">
                      {member.memberExperience} yrs
                    </span>
                  </td>
                  <td>
                    <div className="skill-chips">
                      {member.memberSkillset.map((skill) => (
                        <span key={skill} className="member-skillset-pill">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="cell-desc">
                    {member.memberDescription || "—"}
                  </td>
                  <td className="cell-date">
                    {formatDate(member.projectStartDate)}
                  </td>
                  <td className="cell-date">
                    {formatDate(member.projectEndDate)}
                  </td>
                  <td className="cell-alloc">
                    {member.memberAllocationPercentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
