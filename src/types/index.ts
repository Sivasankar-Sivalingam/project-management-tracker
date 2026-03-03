// TypeScript interfaces for the Project Management Tracker

export interface Member {
  id: string;
  name: string;
  experience: number;            // Must be > 4
  skillsets: string[];           // Must have >= 3
  description: string;
  projectStartDate: string;      // ISO date string
  projectEndDate: string;        // Must be > projectStartDate
  allocationPercentage: number;
}

export interface ApprovalHistory {
  level: number;
  approver: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  date: string | null;
}

export interface Task {
  id: string;
  memberId: string;
  memberName: string;
  taskName: string;
  deliverables: string;
  taskStartDate: string;
  taskEndDate: string;           // Must be > taskStartDate; must not exceed projectEndDate
  history: ApprovalHistory[];
}

export interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

// Factory error shape
export interface FactoryError {
  field: string;
  message: string;
}

// Navigation menu item
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: string;
  badgeVariant?: 'blue' | 'purple' | 'green' | 'yellow';
}
