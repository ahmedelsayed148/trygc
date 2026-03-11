import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Root,
      HydrateFallback: () => null,
      children: [
        {
          index: true,
          lazy: async () => ({ Component: (await import("./components/CriteriaOpsWorkspace")).default }),
        },
        {
          path: "dashboard",
          lazy: async () => ({ Component: (await import("./components/Dashboard")).Dashboard }),
        },
        {
          path: "demo",
          lazy: async () => ({ Component: (await import("./components/PlatformDemo")).PlatformDemo }),
        },
        {
          path: "tasks",
          lazy: async () => ({ Component: (await import("./components/AllTasks")).AllTasks }),
        },
        {
          path: "functions",
          lazy: async () => ({ Component: (await import("./components/FunctionKanban")).FunctionKanban }),
        },
        {
          path: "analytics",
          lazy: async () => ({ Component: (await import("./components/Analytics")).Analytics }),
        },
        {
          path: "personal",
          lazy: async () => ({ Component: (await import("./components/PersonalDashboardRoute")).PersonalDashboard }),
        },
        {
          path: "member-views",
          lazy: async () => ({ Component: (await import("./components/MemberViews")).MemberViews }),
        },
        {
          path: "successes",
          lazy: async () => ({ Component: (await import("./components/SuccessesFeed")).SuccessesFeed }),
        },
        {
          path: "settings",
          lazy: async () => ({ Component: (await import("./components/Settings")).Settings }),
        },
        {
          path: "reports",
          lazy: async () => ({ Component: (await import("./components/Reports")).Reports }),
        },
        {
          path: "archive",
          lazy: async () => ({ Component: (await import("./components/Archive")).Archive }),
        },
        {
          path: "community-team",
          lazy: async () => ({ Component: (await import("./components/CommunityTeam")).CommunityTeam }),
        },
        {
          path: "user-management",
          lazy: async () => ({ Component: (await import("./components/UserManagementRoute")).UserManagementRoute }),
        },
        {
          path: "data-export",
          lazy: async () => ({ Component: (await import("./components/DataExport")).DataExport }),
        },
        {
          path: "data-import",
          lazy: async () => ({ Component: (await import("./components/DataImport")).DataImport }),
        },
        {
          path: "mistakes",
          lazy: async () => ({ Component: (await import("./components/MistakeLogger")).MistakeLogger }),
        },
        {
          path: "ops",
          lazy: async () => ({ Component: (await import("./components/OpsCommand")).OpsCommand }),
        },
        {
          path: "campaigns",
          lazy: async () => ({ Component: (await import("./components/CampaignsManager")).CampaignsManager }),
        },
        {
          path: "campaign-watch",
          lazy: async () => ({ Component: (await import("./components/UpcomingCampaigns")).UpcomingCampaigns }),
        },
        {
          path: "master-tasks",
          lazy: async () => ({ Component: (await import("./components/MasterCampaignTasks")).MasterCampaignTasks }),
        },
        {
          path: "*",
          lazy: async () => ({ Component: (await import("./components/NotFound")).NotFound }),
        },
      ],
    },
  ],
  {
    future: {
      v7_skipActionErrorRevalidation: true,
    },
  }
);
