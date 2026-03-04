import {
  UserPlus,
  Users,
  CheckSquare,
  ClipboardList,
  PieChart,
  type LucideIcon,
} from "lucide-react";

interface FeatureCardData {
  to: string;
  icon: LucideIcon;
  accent: "blue" | "purple" | "green" | "yellow" | "red";
  title: string;
  desc: string;
  cta: string;
}

const FEATURE_CARDS: FeatureCardData[] = [
  {
    to: "/add-member",
    icon: UserPlus,
    accent: "blue",
    title: "Add Team Member",
    desc: "Register a new team member with full profile validation: minimum 4 years experience, at least 3 skillsets, and valid project date ranges.",
    cta: "Add Member",
  },
  {
    to: "/members",
    icon: Users,
    accent: "purple",
    title: "View All Members",
    desc: "Fetch and display all team member profiles from the mock API, sorted in descending order of experience.",
    cta: "View Members",
  },
  {
    to: "/assign-task",
    icon: CheckSquare,
    accent: "green",
    title: "Assign Task",
    desc: "Create and assign tasks to team members with date validation — task end date must not exceed the member's project end date.",
    cta: "Assign Task",
  },
  {
    to: "/tasks",
    icon: ClipboardList,
    accent: "yellow",
    title: "View Tasks",
    desc: "Search tasks by Member ID and review the full approval hierarchy — who has approved and who it's pending with at the next level.",
    cta: "View Tasks",
  },
  {
    to: "/allocation",
    icon: PieChart,
    accent: "red",
    title: "Update Allocation",
    desc: "Adjust team member allocation percentages with automatic business rules: expired projects are auto-set to 0%, active projects to 100%.",
    cta: "Update Allocation",
  },
];

export default FEATURE_CARDS;
