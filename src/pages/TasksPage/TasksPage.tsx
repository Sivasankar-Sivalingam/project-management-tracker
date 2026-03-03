import { ClipboardList } from "lucide-react";
import "./TasksPage.css";

export default function TasksPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header__icon-wrap icon-bg-yellow">
          <ClipboardList size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="page-header__title">View Tasks</h2>
          <p className="page-header__subtitle">
            Task viewer with approval history — coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
