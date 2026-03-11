import exportedTasksCsv from '../../../tasks_export_2026-03-11.csv?raw';

export const CAMPAIGN_PHASES = [
  'Planning',
  'Briefing',
  'Activation',
  'Live',
  'Post-Campaign',
  'Closed',
] as const;

export const CAMPAIGN_STATUSES = [
  'Planning',
  'Active',
  'Paused',
  'Completed',
  'Archived',
] as const;

export const TASK_STATUSES = ['Pending', 'In Progress', 'Blocked', 'Done'] as const;
export const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const;

export type CampaignPhase = (typeof CAMPAIGN_PHASES)[number];
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];
export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type AssignmentMode = 'unassigned' | 'team' | 'person';

export interface OperationsTeam {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  defaultTasks: Array<{
    title: string;
    subarea: string;
    market: string;
    description: string;
    priority?: TaskPriority;
  }>;
}

export interface CampaignTeamTask {
  id: string;
  title: string;
  subarea: string;
  market: string;
  description: string;
  teamId: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignmentMode: AssignmentMode;
  assignedTeamId: string;
  assignedToName: string;
  assignedToEmail: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignTeamPlan {
  teamId: string;
  teamName: string;
  summary: string;
  tasks: CampaignTeamTask[];
}

export interface OpsCampaign {
  id: string;
  name: string;
  client: string;
  market: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  priority: TaskPriority;
  currentPhase: CampaignPhase;
  owner: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  teamPlans: CampaignTeamPlan[];
}

export interface FlattenedOperationalTask extends CampaignTeamTask {
  campaignId: string;
  campaign: string;
  campaignStatus: CampaignStatus;
  campaignPhase: CampaignPhase;
  teamName: string;
  assignedTo: string;
  assignedLabel: string;
  startDateTime: string;
  endDateTime?: string;
  slaHrs: number;
  metricCON: number;
  metricCOV: number;
  metricTarget: number;
  metricConfirmationToday: number;
}

interface ExportedTaskRow {
  dept: string;
  subarea: string;
  title: string;
  market: string;
  priority: string;
}

const OPERATIONS_TEAM_METADATA: Array<Omit<OperationsTeam, 'defaultTasks'>> = [
  {
    id: 'inbound',
    name: 'Inbound',
    shortLabel: 'INB',
    description: 'Inbound handling, inquiries, complaints, and referral intake.',
  },
  {
    id: 'outbound',
    name: 'Outbound',
    shortLabel: 'OUT',
    description: 'Activation, outbound follow-up, confirmations, and coordination.',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    shortLabel: 'WA',
    description: 'WhatsApp, social, and web chat execution with escalations.',
  },
  {
    id: 'quality',
    name: 'Quality',
    shortLabel: 'QA',
    description: 'Audits, coaching, training, and quality improvement loops.',
  },
  {
    id: 'acquisition',
    name: 'Acquisition',
    shortLabel: 'ACQ',
    description: 'Sourcing, expansion, targeting, and influencer acquisition pipelines.',
  },
  {
    id: 'postcampaign',
    name: 'Post-Campaign',
    shortLabel: 'POST',
    description: 'Post-campaign feedback, reporting, retention, and complaint handling.',
  },
  {
    id: 'coordination',
    name: 'Coordination',
    shortLabel: 'COORD',
    description: 'Cross-team coordination, action tracking, meetings, and escalations.',
  },
  {
    id: 'coverage',
    name: 'Coverage',
    shortLabel: 'COV',
    description: 'Coverage monitoring across channels, onboarding, sourcing, and reporting.',
  },
  {
    id: 'keyaccounts',
    name: 'Key Accounts',
    shortLabel: 'KA',
    description: 'Client lifecycle, issue resolution, updates, and commercial retention.',
  },
];

const LEGACY_TEAM_ID_ALIASES: Record<string, string> = {
  'key-accounts': 'keyaccounts',
  'post-campaign': 'postcampaign',
};

function normalizeTeamId(teamId: unknown): string {
  if (typeof teamId !== 'string') {
    return '';
  }

  return LEGACY_TEAM_ID_ALIASES[teamId] || teamId;
}

function normalizeTaskStatus(status: unknown): TaskStatus {
  if (status === 'To Do') {
    return 'Pending';
  }

  if (TASK_STATUSES.includes(status as TaskStatus)) {
    return status as TaskStatus;
  }

  return 'Pending';
}

function normalizeTaskPriority(priority: unknown): TaskPriority {
  if (TASK_PRIORITIES.includes(priority as TaskPriority)) {
    return priority as TaskPriority;
  }

  return 'Medium';
}

function parseCsvRow(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    current += character;
  }

  values.push(current);
  return values;
}

function parseExportedTaskRows(csvText: string): ExportedTaskRow[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return [];
  }

  const headers = parseCsvRow(lines[0]).map((header) => header.replace(/^\uFEFF/, ''));
  const columnIndex = Object.fromEntries(headers.map((header, index) => [header, index]));

  return lines.slice(1).map((line) => {
    const columns = parseCsvRow(line);
    return {
      dept: columns[columnIndex.dept] || '',
      subarea: columns[columnIndex.subarea] || '',
      title: columns[columnIndex.title] || '',
      market: columns[columnIndex.market] || 'ALL',
      priority: columns[columnIndex.priority] || 'Medium',
    };
  }).filter((row) => row.dept && row.title);
}

const EXPORTED_TEAM_TASKS = parseExportedTaskRows(exportedTasksCsv).reduce<Record<string, OperationsTeam['defaultTasks']>>(
  (accumulator, row) => {
    const teamId = normalizeTeamId(row.dept);

    if (!accumulator[teamId]) {
      accumulator[teamId] = [];
    }

    accumulator[teamId].push({
      title: row.title,
      subarea: row.subarea || row.title,
      market: row.market || 'ALL',
      description: row.subarea && row.subarea !== row.title ? row.subarea : '',
      priority: normalizeTaskPriority(row.priority),
    });

    return accumulator;
  },
  {},
);

export const MARKETS = ['EGY', 'KSA', 'KW', 'UAE', 'QAT', 'BH', 'OMAN', 'GCC', 'Regional'] as const;
export const TASK_MARKETS = ['ALL', ...MARKETS] as const;

export const OPERATIONS_TEAMS: OperationsTeam[] = OPERATIONS_TEAM_METADATA.map((team) => ({
  ...team,
  defaultTasks: EXPORTED_TEAM_TASKS[team.id] || [],
}));

export const ALL_TEAM_IDS = OPERATIONS_TEAMS.map((team) => team.id);

export function createId(prefix = 'op') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getTeamDefinition(teamId: string) {
  return OPERATIONS_TEAMS.find((team) => team.id === normalizeTeamId(teamId));
}

export function getAssigneeLabel(task: CampaignTeamTask, fallbackTeamName?: string) {
  if (task.assignmentMode === 'person' && task.assignedToName) {
    return task.assignedToName;
  }

  if (task.assignmentMode === 'team') {
    const assignedTeam = getTeamDefinition(task.assignedTeamId || task.teamId);
    return assignedTeam?.name || fallbackTeamName || 'Assigned Team';
  }

  return 'Unassigned';
}

export function createCampaignTask(teamId: string, seed?: Partial<CampaignTeamTask>): CampaignTeamTask {
  const now = new Date().toISOString();
  const normalizedTeamId = normalizeTeamId(seed?.teamId || teamId) || teamId;

  return {
    id: seed?.id || createId('task'),
    title: seed?.title || 'New task',
    subarea: seed?.subarea || seed?.title || 'New task',
    market: seed?.market || 'ALL',
    description: seed?.description || '',
    teamId: normalizedTeamId,
    status: normalizeTaskStatus(seed?.status),
    priority: normalizeTaskPriority(seed?.priority),
    dueDate: seed?.dueDate || '',
    assignmentMode: seed?.assignmentMode || 'team',
    assignedTeamId: normalizeTeamId(seed?.assignedTeamId || normalizedTeamId) || normalizedTeamId,
    assignedToName: seed?.assignedToName || '',
    assignedToEmail: seed?.assignedToEmail || '',
    notes: seed?.notes || '',
    createdAt: seed?.createdAt || now,
    updatedAt: seed?.updatedAt || now,
  };
}

export function buildTeamPlansForCampaign(
  campaignName: string,
  startDate = '',
  existingPlans?: any[],
): CampaignTeamPlan[] {
  return OPERATIONS_TEAMS.map((team) => {
    const existingPlan = existingPlans?.find((plan) => normalizeTeamId(plan?.teamId) === team.id);
    const existingTasks = Array.isArray(existingPlan?.tasks) ? existingPlan.tasks : [];
    const tasks = existingTasks.length > 0
      ? existingTasks.map((task: any) =>
          createCampaignTask(team.id, {
            ...task,
            teamId: team.id,
            assignedTeamId: normalizeTeamId(task?.assignedTeamId || team.id) || team.id,
          }),
        )
      : team.defaultTasks.map((template) =>
          createCampaignTask(team.id, {
            title: template.title,
            subarea: template.subarea,
            market: template.market,
            description: template.description.replace('{campaign}', campaignName),
            priority: template.priority || 'Medium',
            dueDate: startDate,
            assignmentMode: 'team',
            assignedTeamId: team.id,
          }),
        );

    return {
      teamId: team.id,
      teamName: team.name,
      summary: existingPlan?.summary || team.description,
      tasks,
    };
  });
}

export function createOpsCampaign(seed?: Partial<OpsCampaign>): OpsCampaign {
  const now = new Date().toISOString();
  const name = seed?.name || 'New Campaign';
  const startDate = seed?.startDate || '';

  return {
    id: seed?.id || createId('campaign'),
    name,
    client: seed?.client || '',
    market: seed?.market || 'EGY',
    budget: seed?.budget || 0,
    startDate,
    endDate: seed?.endDate || '',
    status: seed?.status || 'Planning',
    priority: normalizeTaskPriority(seed?.priority),
    currentPhase: seed?.currentPhase || 'Planning',
    owner: seed?.owner || '',
    notes: seed?.notes || '',
    createdAt: seed?.createdAt || now,
    updatedAt: seed?.updatedAt || now,
    teamPlans: buildTeamPlansForCampaign(name, startDate, seed?.teamPlans),
  };
}

export function normalizeOpsCampaigns(rawCampaigns: any[] | undefined | null): OpsCampaign[] {
  if (!Array.isArray(rawCampaigns)) {
    return [];
  }

  return rawCampaigns.map((campaign) => {
    const normalized = createOpsCampaign({
      ...campaign,
      status: CAMPAIGN_STATUSES.includes(campaign?.status) ? campaign.status : 'Planning',
      priority: normalizeTaskPriority(campaign?.priority),
      currentPhase: CAMPAIGN_PHASES.includes(campaign?.currentPhase) ? campaign.currentPhase : 'Planning',
      owner: campaign?.owner || campaign?.assignedAgent || '',
      notes: campaign?.notes || '',
      market: campaign?.market || 'EGY',
      teamPlans: campaign?.teamPlans,
    });

    return {
      ...normalized,
      teamPlans: buildTeamPlansForCampaign(normalized.name, normalized.startDate, campaign?.teamPlans),
    };
  });
}

export function flattenOperationalTasks(campaigns: OpsCampaign[]): FlattenedOperationalTask[] {
  return campaigns.flatMap((campaign) =>
    campaign.teamPlans.flatMap((plan) =>
      plan.tasks.map((task) => ({
        ...task,
        campaignId: campaign.id,
        campaign: campaign.name,
        campaignStatus: campaign.status,
        campaignPhase: campaign.currentPhase,
        teamName: plan.teamName,
        assignedTo: task.assignedToName || task.assignedToEmail || '',
        assignedLabel: getAssigneeLabel(task, plan.teamName),
        startDateTime: task.createdAt,
        endDateTime: task.status === 'Done' ? task.updatedAt : undefined,
        slaHrs: 24,
        metricCON: 0,
        metricCOV: 0,
        metricTarget: 0,
        metricConfirmationToday: 0,
      })),
    ),
  );
}

export function getCampaignProgress(campaign: OpsCampaign) {
  const tasks = campaign.teamPlans.flatMap((plan) => plan.tasks);
  const total = tasks.length;
  const done = tasks.filter((task) => task.status === 'Done').length;
  const blocked = tasks.filter((task) => task.status === 'Blocked').length;
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  return {
    total,
    done,
    blocked,
    completionRate,
  };
}
