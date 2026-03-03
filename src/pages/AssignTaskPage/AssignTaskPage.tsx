import { CheckSquare } from "lucide-react";
import "./AssignTaskPage.css";

export default function AssignTaskPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header__icon-wrap icon-bg-green">
          <CheckSquare size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="page-header__title">Assign Task</h2>
          <p className="page-header__subtitle">
            TaskFactory form with date validation — coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
