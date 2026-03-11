import { createBrowserRouter } from "react-router";
import Root from "./Root";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Root,
      HydrateFallback: () => null,
      children: [
        {
          index: true,
          lazy: async () => ({ Component: (await import("./pages/CriteriaOpsWorkspace")).default }),
        },
        {
          path: "dashboard",
          lazy: async () => ({ Component: (await import("./pages/Dashboard")).default }),
        },
        {
          path: "demo",
          lazy: async () => ({ Component: (await import("./pages/PlatformDemo")).default }),
        },
        {
          path: "tasks",
          lazy: async () => ({ Component: (await import("./pages/AllTasks")).default }),
        },
        {
          path: "functions",
          lazy: async () => ({ Component: (await import("./pages/FunctionKanban")).default }),
        },
        {
          path: "analytics",
          lazy: async () => ({ Component: (await import("./pages/Analytics")).default }),
        },
        {
          path: "personal",
          lazy: async () => ({ Component: (await import("./pages/PersonalDashboard")).default }),
        },
        {
          path: "successes",
          lazy: async () => ({ Component: (await import("./pages/SuccessesFeed")).default }),
        },
        {
          path: "reports",
          lazy: async () => ({ Component: (await import("./pages/Reports")).default }),
        },
        {
          path: "archive",
          lazy: async () => ({ Component: (await import("./pages/Archive")).default }),
        },
        {
          path: "community-team",
          lazy: async () => ({ Component: (await import("./pages/CommunityTeam")).default }),
        },
        {
          path: "user-management",
          lazy: async () => ({ Component: (await import("./pages/UserManagement")).default }),
        },
        {
          path: "data-export",
          lazy: async () => ({ Component: (await import("./pages/DataExport")).default }),
        },
        {
          path: "mistakes",
          lazy: async () => ({ Component: (await import("./pages/MistakeLogger")).default }),
        },
        {
          path: "ops",
          lazy: async () => ({ Component: (await import("./pages/OpsCommand")).default }),
        },
        {
          path: "campaigns",
          lazy: async () => ({ Component: (await import("./pages/CampaignsManager")).default }),
        },
        {
          path: "master-tasks",
          lazy: async () => ({ Component: (await import("./pages/MasterCampaignTasks")).default }),
        },
        {
          path: "*",
          lazy: async () => ({ Component: (await import("./pages/NotFound")).default }),
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
