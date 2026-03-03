import { Users } from "lucide-react";
import "./MembersPage.css";

export default function MembersPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header__icon-wrap icon-bg-purple">
          <Users size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="page-header__title">Team Members</h2>
          <p className="page-header__subtitle">
            Fetch all members sorted by experience — coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
