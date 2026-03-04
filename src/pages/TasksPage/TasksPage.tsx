import { useEffect, useRef, useState } from "react";
import { ClipboardList, Search, AlertCircle } from "lucide-react";
import type { Task, MemberData, ApprovalHistory } from "../../types";
import "./TasksPage.css";

function formatDate(iso: string | null) {
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

function ApprovalStatusBadge({
  status,
}: {
  status: ApprovalHistory["status"];
}) {
  const statusClass: Record<ApprovalHistory["status"], string> = {
    Approved: "status-badge status-approved",
    Pending: "status-badge status-pending",
    Rejected: "status-badge status-rejected",
  };
  return <span className={statusClass[status]}>{status}</span>;
}

export default function TasksPage() {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
  const [taskError, setTaskError] = useState<string | null>(null);
  const [taskLoading, setTaskLoading] = useState(false);

  const searchWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("http://localhost:3001/members")
      .then((res) => res.json())
      .then((data: MemberData[]) => setMembers(data))
      .catch(() => {});
  }, []);

  // Close suggestion dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchWrapRef.current &&
        !searchWrapRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMembers = searchInput.trim()
    ? members.filter(
        (member) =>
          member.memberName.toLowerCase().includes(searchInput.toLowerCase()) ||
          member.memberId.toLowerCase().includes(searchInput.toLowerCase()),
      )
    : [];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
    setShowSuggestions(true);
    setTask(null);
    setSelectedMember(null);
    setTaskError(null);
  };

  const handleSelectMember = async (member: MemberData) => {
    setSearchInput(`${member.memberName} (${member.memberId})`);
    setShowSuggestions(false);
    setSelectedMember(member);
    setTask(null);
    setTaskError(null);
    setTaskLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/tasks?memberId=${encodeURIComponent(member.memberId)}`,
      );
      if (!response.ok) throw new Error();

      const tasks: Task[] = await response.json();
      const matchedTask = tasks[0] ?? null;

      if (!matchedTask) {
        setTaskError(
          `No task assigned to ${member.memberName} (${member.memberId}).`,
        );
      } else {
        setTask(matchedTask);
      }
    } catch {
      setTaskError(
        "Could not fetch task data. Is the mock server running on :3001?",
      );
    } finally {
      setTaskLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header__icon-wrap icon-bg-yellow">
          <ClipboardList size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="page-header__title">View Tasks</h2>
          <p className="page-header__subtitle">
            Search by member name or ID to view task details and approval
            history.
          </p>
        </div>
      </div>

      <div className="search-wrap" ref={searchWrapRef}>
        <div className="search-input-row">
          <Search size={15} className="search-icon" />
          <input
            id="memberSearch"
            className="search-input"
            type="text"
            placeholder="Search by member name or ID…"
            value={searchInput}
            onChange={handleInputChange}
            onFocus={() => searchInput.trim() && setShowSuggestions(true)}
            autoComplete="off"
          />
        </div>

        {showSuggestions && filteredMembers.length > 0 && (
          <ul className="suggestions-list" role="listbox">
            {filteredMembers.map((member) => (
              <li
                key={member.memberId}
                className="suggestion-item"
                role="option"
                onMouseDown={() => handleSelectMember(member)}
              >
                <span className="suggestion-name">{member.memberName}</span>
                <span className="suggestion-id">{member.memberId}</span>
              </li>
            ))}
          </ul>
        )}

        {showSuggestions &&
          searchInput.trim() &&
          filteredMembers.length === 0 && (
            <div className="suggestions-empty">
              No members match your search.
            </div>
          )}
      </div>

      {/* Task loading */}
      {taskLoading && (
        <div className="task-loading">
          <div className="spinner" />
          Fetching task…
        </div>
      )}

      {/* Task error */}
      {taskError && (
        <div className="task-error">
          <AlertCircle size={16} />
          {taskError}
        </div>
      )}

      {/* Results */}
      {task && selectedMember && (
        <div className="task-results">
          {/* Task details */}
          <div className="info-card">
            <p className="info-card__title">Task Details</p>
            <div className="info-grid">
              <div className="info-field">
                <span className="info-label">Task Name</span>
                <span className="info-value">{task.taskName}</span>
              </div>
              <div className="info-field">
                <span className="info-label">Member</span>
                <span className="info-value">{task.memberName}</span>
              </div>
              <div className="info-field">
                <span className="info-label">Task Start Date</span>
                <span className="info-value">
                  {formatDate(task.taskStartDate)}
                </span>
              </div>
              <div className="info-field">
                <span className="info-label">Task End Date</span>
                <span className="info-value">
                  {formatDate(task.taskEndDate)}
                </span>
              </div>
              <div className="info-field info-field--full">
                <span className="info-label">Deliverables</span>
                <span className="info-value">{task.deliverables}</span>
              </div>
            </div>
          </div>

          {/* Project & allocation */}
          <div className="info-card">
            <p className="info-card__title">Project & Allocation</p>
            <div className="info-grid">
              <div className="info-field">
                <span className="info-label">Project Start Date</span>
                <span className="info-value">
                  {formatDate(selectedMember.projectStartDate)}
                </span>
              </div>
              <div className="info-field">
                <span className="info-label">Project End Date</span>
                <span className="info-value">
                  {formatDate(selectedMember.projectEndDate)}
                </span>
              </div>
              <div className="info-field">
                <span className="info-label">Allocation</span>
                <span className="info-value info-value--accent">
                  {selectedMember.memberAllocationPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Approval history */}
          <div className="info-card">
            <p className="info-card__title">Approval History</p>
            {task.history.length === 0 ? (
              <p className="no-history">No approval history available.</p>
            ) : (
              <div className="approval-table-wrap">
                <table className="approval-table" aria-label="Approval history">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Approver</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {task.history.map((entry) => (
                      <tr key={entry.level}>
                        <td className="cell-level">L{entry.level}</td>
                        <td className="cell-approver">{entry.approver}</td>
                        <td>
                          <ApprovalStatusBadge status={entry.status} />
                        </td>
                        <td className="cell-date">{formatDate(entry.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
