import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-b626472b/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all data
app.get("/make-server-b626472b/data", async (c) => {
  try {
    const tasks = await kv.get("tasks");
    const successLogs = await kv.get("success_logs");
    const taskNotifications = await kv.get("task_notifications");
    const mistakes = await kv.get("mistakes");
    const tasksPerTeam = await kv.get("tasks_per_team");
    const opsCampaigns = await kv.get("ops_campaigns");
    return c.json({ 
      tasks: tasks || [],
      successLogs: successLogs || [],
      taskNotifications: taskNotifications || [],
      mistakes: mistakes || [],
      tasksPerTeam: tasksPerTeam || {},
      opsCampaigns: opsCampaigns || [],
    });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Save the connected workspace in one request
app.post("/make-server-b626472b/workspace", async (c) => {
  try {
    const {
      tasks = [],
      successLogs = [],
      taskNotifications = [],
      mistakes = [],
      tasksPerTeam = {},
      opsCampaigns = [],
    } = await c.req.json();

    await kv.mset(
      ["tasks", "success_logs", "task_notifications", "mistakes", "tasks_per_team", "ops_campaigns"],
      [tasks, successLogs, taskNotifications, mistakes, tasksPerTeam, opsCampaigns],
    );

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Save tasks
app.post("/make-server-b626472b/tasks", async (c) => {
  try {
    const { tasks } = await c.req.json();
    await kv.set("tasks", tasks);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Save success logs
app.post("/make-server-b626472b/success-logs", async (c) => {
  try {
    const { successLogs } = await c.req.json();
    await kv.set("success_logs", successLogs);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Save task notifications
app.post("/make-server-b626472b/task-notifications", async (c) => {
  try {
    const { taskNotifications } = await c.req.json();
    await kv.set("task_notifications", taskNotifications);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Get mistake logs
app.get("/make-server-b626472b/mistakes", async (c) => {
  try {
    const mistakes = await kv.get("mistakes");
    return c.json({ mistakes: mistakes || [] });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Save mistake logs
app.post("/make-server-b626472b/mistakes", async (c) => {
  try {
    const { mistakes } = await c.req.json();
    await kv.set("mistakes", mistakes);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Get admin config
app.get("/make-server-b626472b/admin-config", async (c) => {
  try {
    const config = await kv.get("admin_config");
    return c.json({ config: config || { adminEmails: [], teamMembers: [] } });
  } catch (error) {
    console.log(`Error fetching admin config: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Save admin config (initialize or update)
app.post("/make-server-b626472b/admin-config", async (c) => {
  try {
    const { config } = await c.req.json();
    await kv.set("admin_config", config);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving admin config: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Get meeting minutes
app.get("/make-server-b626472b/meeting-minutes", async (c) => {
  try {
    const minutes = await kv.get("meeting_minutes");
    return c.json({ minutes: minutes || [] });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Save meeting minutes
app.post("/make-server-b626472b/meeting-minutes", async (c) => {
  try {
    const { minutes } = await c.req.json();
    await kv.set("meeting_minutes", minutes);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Auto-register: if no admins exist, make the caller admin
app.post("/make-server-b626472b/auto-register", async (c) => {
  try {
    const { email, name } = await c.req.json();
    if (!email) {
      return c.json({ error: "Email is required for auto-register" }, 400);
    }

    // Owner email — always admin, cannot be changed by anyone
    const OWNER_EMAIL = 'ahmedlalatoo2013@gmail.com';
    // Default admin emails — will be set as admin on first setup, but manageable by owner
    const DEFAULT_ADMIN_EMAILS = [
      'ahmedlalatoo2013@gmail.com',
      'adel@try-gc.com',
    ];

    // Canonical list of all default admin features — keep in sync with UserManagement.tsx
    const ALL_ADMIN_FEATURES = [
      'dashboard', 'tasks', 'shift-tasks', 'functions', 'analytics',
      'member-views', 'successes', 'reports', 'archive', 'meeting-minutes',
      'upload-xlsx', 'settings', 'personal', 'data-export', 'data-import',
    ];
    const DEFAULT_MEMBER_FEATURES = ['personal', 'meeting-minutes', 'shift-tasks', 'successes', 'settings'];

    let config = await kv.get("admin_config");
    if (!config) {
      config = { adminEmails: [], teamMembers: [] };
    }

    const emailLower = email.toLowerCase();
    const isOwner = emailLower === OWNER_EMAIL.toLowerCase();

    // If no admins exist yet, seed with default admins
    if (!config.adminEmails || config.adminEmails.length === 0) {
      config.adminEmails = DEFAULT_ADMIN_EMAILS.map((e: string) => e.toLowerCase());
      config.teamMembers = DEFAULT_ADMIN_EMAILS.map((e: string) => ({
        email: e.toLowerCase(),
        name: e.toLowerCase() === emailLower ? (name || e) : e,
        role: 'admin',
        features: ALL_ADMIN_FEATURES,
        addedAt: new Date().toISOString(),
        demoCompleted: true, // default admins skip the demo
      }));
      await kv.set("admin_config", config);
      if (DEFAULT_ADMIN_EMAILS.map((e: string) => e.toLowerCase()).includes(emailLower)) {
        const member = config.teamMembers.find((m: any) => m.email === emailLower);
        return c.json({ role: 'admin', config, features: member?.features || null, demoCompleted: true });
      }
    }

    // Owner is always forced to admin
    if (isOwner && !config.adminEmails.map((e: string) => e.toLowerCase()).includes(emailLower)) {
      config.adminEmails.push(emailLower);
    }

    const isAdmin = isOwner || config.adminEmails.map((e: string) => e.toLowerCase()).includes(emailLower);
    
    // Check if user is already a team member
    const existingMemberIdx = (config.teamMembers || []).findIndex((m: any) => m.email.toLowerCase() === emailLower);
    
    if (existingMemberIdx === -1) {
      // Add as team member automatically
      if (!config.teamMembers) config.teamMembers = [];
      config.teamMembers.push({ 
        email: emailLower, 
        name: name || email, 
        role: isAdmin ? 'admin' : 'member',
        features: isAdmin ? ALL_ADMIN_FEATURES : DEFAULT_MEMBER_FEATURES,
        addedAt: new Date().toISOString(),
        demoCompleted: false, // new users must complete demo
      });
      await kv.set("admin_config", config);
    } else {
      let needsSave = false;

      // Force owner to admin role
      if (isOwner && config.teamMembers[existingMemberIdx].role !== 'admin') {
        config.teamMembers[existingMemberIdx].role = 'admin';
        needsSave = true;
      }

      // Auto-sync: ensure existing admin users have all default admin features
      // (adds any newly introduced features without removing custom ones)
      const member = config.teamMembers[existingMemberIdx];
      if (member.role === 'admin' && member.features) {
        const missingFeatures = ALL_ADMIN_FEATURES.filter(
          (f: string) => !member.features.includes(f)
        );
        if (missingFeatures.length > 0) {
          member.features = [...member.features, ...missingFeatures];
          needsSave = true;
          console.log(`Auto-synced ${missingFeatures.length} missing features for admin ${emailLower}: ${missingFeatures.join(', ')}`);
        }
      }

      // Auto-sync: ensure existing member users have all default member features
      if (member.role === 'member' && member.features) {
        const missingFeatures = DEFAULT_MEMBER_FEATURES.filter(
          (f: string) => !member.features.includes(f)
        );
        if (missingFeatures.length > 0) {
          member.features = [...member.features, ...missingFeatures];
          needsSave = true;
          console.log(`Auto-synced ${missingFeatures.length} missing features for member ${emailLower}: ${missingFeatures.join(', ')}`);
        }
      }

      if (needsSave) {
        await kv.set("admin_config", config);
      }
    }

    // Get user's features
    const member = (config.teamMembers || []).find((m: any) => m.email.toLowerCase() === emailLower);
    const userFeatures = member?.features || null;
    const demoCompleted = member?.demoCompleted === true;

    return c.json({ role: isAdmin ? 'admin' : 'member', config, features: userFeatures, demoCompleted });
  } catch (error) {
    console.log(`Error in auto-register: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Signup endpoint
app.post("/make-server-b626472b/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: "Email and password are required for signup" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || '' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.log(`Signup error for ${email}: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log(`Unexpected signup error: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Reset all data
app.delete("/make-server-b626472b/reset-data", async (c) => {
  try {
    await kv.del("tasks");
    await kv.del("success_logs");
    await kv.del("task_notifications");
    await kv.del("mistakes");
    await kv.del("tasks_per_team");
    await kv.del("ops_tasks");
    await kv.del("ops_campaigns");
    return c.json({ success: true });
  } catch (error) {
    console.log(`Reset data error: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Get ops data (tasks + campaigns)
app.get("/make-server-b626472b/ops-data", async (c) => {
  try {
    const opsTasks = await kv.get("ops_tasks");
    const opsCampaigns = await kv.get("ops_campaigns");
    return c.json({ opsTasks: opsTasks || null, opsCampaigns: opsCampaigns || [] });
  } catch (error) {
    console.log(`Error fetching ops data: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Save ops tasks
app.post("/make-server-b626472b/ops-tasks", async (c) => {
  try {
    const { opsTasks } = await c.req.json();
    await kv.set("ops_tasks", opsTasks);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving ops tasks: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Save ops campaigns
app.post("/make-server-b626472b/ops-campaigns", async (c) => {
  try {
    const { opsCampaigns } = await c.req.json();
    await kv.set("ops_campaigns", opsCampaigns);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving ops campaigns: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Export all data
app.get("/make-server-b626472b/export-data", async (c) => {
  try {
    // Get all data from KV store
    const tasks = await kv.get("tasks");
    const successLogs = await kv.get("success_logs");
    const taskNotifications = await kv.get("task_notifications");
    const mistakes = await kv.get("mistakes");
    const tasksPerTeam = await kv.get("tasks_per_team");
    const adminConfig = await kv.get("admin_config");
    const meetingMinutes = await kv.get("meeting_minutes");
    const opsTasks = await kv.get("ops_tasks");
    const opsCampaigns = await kv.get("ops_campaigns");

    const exportData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      data: {
        tasks: tasks || [],
        successLogs: successLogs || [],
        taskNotifications: taskNotifications || [],
        mistakes: mistakes || [],
        tasksPerTeam: tasksPerTeam || {},
        adminConfig: adminConfig || { adminEmails: [], teamMembers: [] },
        meetingMinutes: meetingMinutes || [],
        opsTasks: opsTasks || null,
        opsCampaigns: opsCampaigns || [],
      }
    };

    // Use c.json() so Hono CORS middleware headers are applied
    return c.json(exportData);
  } catch (error) {
    console.log(`Export data error: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Import data
app.post("/make-server-b626472b/import-data", async (c) => {
  try {
    const importData = await c.req.json();

    if (!importData.data) {
      return c.json({ error: "Invalid import file format" }, 400);
    }

    let count = 0;

    // Import tasks
    if (importData.data.tasks) {
      await kv.set("tasks", importData.data.tasks);
      count += Array.isArray(importData.data.tasks) ? importData.data.tasks.length : 0;
    }

    // Import success logs
    if (importData.data.successLogs) {
      await kv.set("success_logs", importData.data.successLogs);
      count += Array.isArray(importData.data.successLogs) ? importData.data.successLogs.length : 0;
    }

    if (importData.data.taskNotifications) {
      await kv.set("task_notifications", importData.data.taskNotifications);
      count += Array.isArray(importData.data.taskNotifications) ? importData.data.taskNotifications.length : 0;
    }

    if (importData.data.mistakes) {
      await kv.set("mistakes", importData.data.mistakes);
      count += Array.isArray(importData.data.mistakes) ? importData.data.mistakes.length : 0;
    }

    if (importData.data.tasksPerTeam) {
      await kv.set("tasks_per_team", importData.data.tasksPerTeam);
    }

    // Import admin config
    if (importData.data.adminConfig) {
      await kv.set("admin_config", importData.data.adminConfig);
    }

    // Import meeting minutes
    if (importData.data.meetingMinutes) {
      await kv.set("meeting_minutes", importData.data.meetingMinutes);
      count += Array.isArray(importData.data.meetingMinutes) ? importData.data.meetingMinutes.length : 0;
    }

    // Import ops tasks
    if (importData.data.opsTasks) {
      await kv.set("ops_tasks", importData.data.opsTasks);
      count += Array.isArray(importData.data.opsTasks) ? importData.data.opsTasks.length : 0;
    }

    // Import ops campaigns
    if (importData.data.opsCampaigns) {
      await kv.set("ops_campaigns", importData.data.opsCampaigns);
      count += Array.isArray(importData.data.opsCampaigns) ? importData.data.opsCampaigns.length : 0;
    }

    return c.json({ success: true, count });
  } catch (error) {
    console.log(`Import data error: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Get shift task assignments
app.get("/make-server-b626472b/shift-assignments", async (c) => {
  try {
    const data = await kv.get("shift_assignments");
    return c.json({ assignments: data || {} });
  } catch (error) {
    console.log(`Error fetching shift assignments: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Save shift task assignments
app.post("/make-server-b626472b/shift-assignments", async (c) => {
  try {
    const { assignments } = await c.req.json();
    await kv.set("shift_assignments", assignments);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving shift assignments: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Get shift task checked state
app.get("/make-server-b626472b/shift-checked", async (c) => {
  try {
    const data = await kv.get("shift_checked");
    return c.json({ checked: data || {} });
  } catch (error) {
    console.log(`Error fetching shift checked state: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Save shift task checked state
app.post("/make-server-b626472b/shift-checked", async (c) => {
  try {
    const { checked } = await c.req.json();
    await kv.set("shift_checked", checked);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving shift checked state: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Get community team data (assignments, checked, notes, custom labels, manager names)
app.get("/make-server-b626472b/community-team-data", async (c) => {
  try {
    const data = await kv.get("community_team_data");
    return c.json({ data: data || {} });
  } catch (error) {
    console.log(`Error fetching community team data: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Save community team data
app.post("/make-server-b626472b/community-team-data", async (c) => {
  try {
    const { data } = await c.req.json();
    await kv.set("community_team_data", data);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving community team data: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Mark demo as completed for a user
app.post("/make-server-b626472b/complete-demo", async (c) => {
  try {
    const { email } = await c.req.json();
    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }
    const emailLower = email.toLowerCase();
    const config = await kv.get("admin_config");
    if (!config || !config.teamMembers) {
      return c.json({ error: "No config found" }, 404);
    }
    const idx = config.teamMembers.findIndex((m: any) => m.email.toLowerCase() === emailLower);
    if (idx === -1) {
      return c.json({ error: "User not found" }, 404);
    }
    config.teamMembers[idx].demoCompleted = true;
    await kv.set("admin_config", config);
    console.log(`Demo completed for user: ${emailLower}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error completing demo: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);