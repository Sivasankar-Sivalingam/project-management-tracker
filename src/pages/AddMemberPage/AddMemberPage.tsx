import { UserPlus } from "lucide-react";
import "./AddMemberPage.css";

export default function AddMemberPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header__icon-wrap icon-bg-blue">
          <UserPlus size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="page-header__title">Add Team Member</h2>
          <p className="page-header__subtitle">
            MemberFactory form with validation — coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
