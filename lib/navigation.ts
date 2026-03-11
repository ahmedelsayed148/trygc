import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Archive,
  BarChart3,
  ClipboardList,
  Download,
  Eye,
  FileText,
  Globe,
  LayoutDashboard,
  LayoutGrid,
  Settings,
  Target,
  Trophy,
  Upload,
  User,
  Users,
  Zap,
} from "lucide-react";

export interface NavItem {
  badge?: string;
  description: string;
  end?: boolean;
  icon: LucideIcon;
  id: string;
  label: string;
  to: string;
}

export const FEATURE_NAV_MAP: Record<string, NavItem> = {
  dashboard: {
    id: "dashboard",
    to: "/",
    label: "Ops Workspace",
    description: "Primary operations workspace with campaigns, SLA, WA shield, agents, and handovers.",
    icon: LayoutDashboard,
    end: true,
  },
  "classic-dashboard": {
    id: "classic-dashboard",
    to: "/dashboard",
    label: "Classic Dash",
    description: "Original dashboard overview preserved as a separate screen.",
    icon: LayoutDashboard,
  },
  personal: {
    id: "personal",
    to: "/personal",
    label: "My Dashboard",
    description: "Your personal workload, performance, and assigned tasks.",
    icon: User,
  },
  "community-team": {
    id: "community-team",
    to: "/community-team",
    label: "Community Team",
    description: "Track community assignments, managers, and checklist coverage.",
    icon: Globe,
  },
  tasks: {
    id: "tasks",
    to: "/tasks",
    label: "All Tasks",
    description: "Master task list across campaigns, assignees, and status.",
    icon: ClipboardList,
  },
  ops: {
    id: "ops",
    to: "/ops",
    label: "OPS Command",
    description: "Operational command center for campaign execution.",
    icon: Zap,
  },
  campaigns: {
    id: "campaigns",
    to: "/campaigns",
    label: "Campaigns",
    description: "Lifecycle management for campaigns across every phase.",
    icon: Target,
  },
  "master-tasks": {
    id: "master-tasks",
    to: "/master-tasks",
    label: "Master Tasks",
    description: "Campaign master-task hierarchy with editable title, dept, and subarea.",
    icon: ClipboardList,
  },
  "campaign-watch": {
    id: "campaign-watch",
    to: "/campaign-watch",
    label: "Campaign Watch",
    description: "Focused view of upcoming launches and ongoing campaigns.",
    icon: Target,
  },
  mistakes: {
    id: "mistakes",
    to: "/mistakes",
    label: "Mistake Logger",
    description: "Capture, resolve, and learn from execution issues.",
    icon: AlertTriangle,
  },
  functions: {
    id: "functions",
    to: "/functions",
    label: "Function Kanban",
    description: "Cross-functional task view by team and workflow stage.",
    icon: LayoutGrid,
  },
  analytics: {
    id: "analytics",
    to: "/analytics",
    label: "Team Analytics",
    description: "Performance trends, completion rates, and team insights.",
    icon: BarChart3,
  },
  "member-views": {
    id: "member-views",
    to: "/member-views",
    label: "Member Views",
    description: "Role-based views for individual contributors and teams.",
    icon: Eye,
  },
  successes: {
    id: "successes",
    to: "/successes",
    label: "Updates",
    description: "Wins, progress updates, and shared team momentum.",
    icon: Trophy,
  },
  reports: {
    id: "reports",
    to: "/reports",
    label: "Reports",
    description: "Structured output for leadership, QA, and performance review.",
    icon: FileText,
  },
  archive: {
    id: "archive",
    to: "/archive",
    label: "Archive",
    description: "Historical records and completed work snapshots.",
    icon: Archive,
  },
  "user-management": {
    id: "user-management",
    to: "/user-management",
    label: "User Mgmt",
    description: "Roles, access, and per-user workspace controls.",
    icon: Users,
  },
  "data-export": {
    id: "data-export",
    to: "/data-export",
    label: "Data Export",
    description: "Backup and export the current workspace state.",
    icon: Download,
  },
  "data-import": {
    id: "data-import",
    to: "/data-import",
    label: "Data Import",
    description: "Restore or migrate workspace data safely.",
    icon: Upload,
  },
  settings: {
    id: "settings",
    to: "/settings",
    label: "Settings",
    description: "Profile, appearance, notifications, and admin settings.",
    icon: Settings,
  },
};

export const DEFAULT_ADMIN_FEATURES = [
  "dashboard",
  "community-team",
  "tasks",
  "classic-dashboard",
  "ops",
  "campaigns",
  "master-tasks",
  "campaign-watch",
  "mistakes",
  "functions",
  "analytics",
  "member-views",
  "successes",
  "reports",
  "archive",
  "settings",
  "user-management",
  "data-export",
  "data-import",
];

export const DEFAULT_MEMBER_FEATURES = [
  "personal",
  "community-team",
  "classic-dashboard",
  "ops",
  "campaigns",
  "master-tasks",
  "campaign-watch",
  "mistakes",
  "successes",
  "settings",
];

export const FEATURE_ORDER = [
  "dashboard",
  "personal",
  "community-team",
  "tasks",
  "classic-dashboard",
  "ops",
  "campaigns",
  "master-tasks",
  "campaign-watch",
  "mistakes",
  "functions",
  "analytics",
  "member-views",
  "successes",
  "reports",
  "archive",
  "user-management",
  "data-export",
  "data-import",
  "settings",
];

export const NAV_SECTIONS = [
  { label: "Core", items: ["/", "/dashboard", "/personal", "/community-team"] },
  { label: "Operations", items: ["/ops", "/campaigns", "/master-tasks", "/campaign-watch", "/tasks", "/mistakes", "/functions"] },
  { label: "Insights", items: ["/analytics", "/member-views", "/successes", "/reports", "/archive"] },
  { label: "Admin", items: ["/user-management", "/data-export", "/data-import", "/settings"] },
];

const OWNER_EMAIL = "ahmedlalatoo2013@gmail.com";

export function resolveFeatureIds({
  isAdmin,
  userEmail,
  userFeatures,
}: {
  isAdmin: boolean;
  userEmail: string;
  userFeatures: string[] | null;
}) {
  const isOwner = userEmail.toLowerCase() === OWNER_EMAIL.toLowerCase();

  const requestedFeatures = isOwner
    ? FEATURE_ORDER
    : userFeatures || (isAdmin ? DEFAULT_ADMIN_FEATURES : DEFAULT_MEMBER_FEATURES);

  const normalizedFeatures = isAdmin && !requestedFeatures.includes("user-management")
    ? [...requestedFeatures, "user-management"]
    : requestedFeatures;

  const connectedFeatures = ["ops", "campaigns", "master-tasks", "campaign-watch"].every((featureId) =>
    normalizedFeatures.includes(featureId),
  )
    ? normalizedFeatures
    : [...normalizedFeatures.filter((featureId) => featureId !== "community" && featureId !== "campaign-tasks"), "ops", "campaigns", "master-tasks", "campaign-watch"];

  return FEATURE_ORDER.filter((featureId) => connectedFeatures.includes(featureId));
}

export function getVisibleNavItems({
  isAdmin,
  userEmail,
  userFeatures,
}: {
  isAdmin: boolean;
  userEmail: string;
  userFeatures: string[] | null;
}) {
  return resolveFeatureIds({ isAdmin, userEmail, userFeatures })
    .map((featureId) => FEATURE_NAV_MAP[featureId])
    .filter(Boolean);
}

export function getCurrentNavItem(pathname: string) {
  const exactMatch = Object.values(FEATURE_NAV_MAP).find((item) =>
    item.end ? pathname === item.to : pathname.startsWith(item.to),
  );

  if (exactMatch) {
    return exactMatch;
  }

  return FEATURE_NAV_MAP.dashboard;
}
