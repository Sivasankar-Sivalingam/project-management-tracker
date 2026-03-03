import { PieChart } from "lucide-react";
import "./AllocationPage.css";

export default function AllocationPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header__icon-wrap icon-bg-red">
          <PieChart size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="page-header__title">Update Allocation</h2>
          <p className="page-header__subtitle">
            Allocation update with business rules — coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
