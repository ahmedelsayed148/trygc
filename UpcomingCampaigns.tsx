import React, { useContext, useMemo } from 'react';
import { CalendarClock, Clock3, Layers3, Target } from 'lucide-react';
import { AppContext } from './Root';
import { getCampaignProgress, normalizeOpsCampaigns } from '../lib/operations';

function isTerminalStatus(status: string) {
  return status === 'Completed' || status === 'Archived';
}

function parseDate(value: string) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(value: string) {
  const parsed = parseDate(value);
  if (!parsed) {
    return 'No date set';
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getDaysFromToday(value: string) {
  const parsed = parseDate(value);
  if (!parsed) {
    return null;
  }

  const today = new Date();
  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const normalizedDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  const diffMs = normalizedDate.getTime() - normalizedToday.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function UpcomingCampaigns() {
  const ctx = useContext(AppContext);
  const campaigns = useMemo(() => normalizeOpsCampaigns(ctx?.opsCampaigns || []), [ctx?.opsCampaigns]);
  const today = new Date();
  const todayStamp = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayLabel = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const { ongoingCampaigns, upcomingCampaigns } = useMemo(() => {
    const ongoing: typeof campaigns = [];
    const upcoming: typeof campaigns = [];

    campaigns.forEach((campaign) => {
      if (isTerminalStatus(campaign.status)) {
        return;
      }

      const startDate = parseDate(campaign.startDate);
      const endDate = parseDate(campaign.endDate);
      const isActiveByStatus = campaign.status === 'Active';
      const isInDateWindow =
        Boolean(startDate) &&
        startDate!.getTime() <= todayStamp.getTime() &&
        (!endDate || endDate.getTime() >= todayStamp.getTime());

      if (isActiveByStatus || isInDateWindow) {
        ongoing.push(campaign);
        return;
      }

      if ((startDate && startDate.getTime() > todayStamp.getTime()) || campaign.status === 'Planning' || campaign.status === 'Paused') {
        upcoming.push(campaign);
      }
    });

    const sortByStartDate = (left: (typeof campaigns)[number], right: (typeof campaigns)[number]) => {
      const leftDate = parseDate(left.startDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const rightDate = parseDate(right.startDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      return leftDate - rightDate;
    };

    return {
      ongoingCampaigns: ongoing.sort(sortByStartDate),
      upcomingCampaigns: upcoming.sort(sortByStartDate),
    };
  }, [campaigns, todayStamp]);

  const totalLiveTasks = ongoingCampaigns.reduce((sum, campaign) => sum + getCampaignProgress(campaign).total, 0);
  const totalUpcomingTasks = upcomingCampaigns.reduce((sum, campaign) => sum + getCampaignProgress(campaign).total, 0);

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-6 dark:bg-black">
      <div className="mx-auto max-w-screen-2xl space-y-6">
        <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-zinc-400">Campaign Watch</p>
              <h1 className="mt-2 text-3xl font-black text-zinc-900 dark:text-zinc-100">Upcoming & ongoing campaigns</h1>
              <p className="mt-2 max-w-3xl text-sm text-zinc-500">
                A focused view of active campaigns already in motion and the next campaigns preparing to launch.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 px-5 py-4 text-right dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">Today</p>
              <p className="mt-1 text-sm font-bold text-zinc-700 dark:text-zinc-200">{todayLabel}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <SummaryCard label="Ongoing" value={ongoingCampaigns.length} icon={Layers3} />
            <SummaryCard label="Upcoming" value={upcomingCampaigns.length} icon={CalendarClock} />
            <SummaryCard label="Live Tasks" value={totalLiveTasks} icon={Target} />
            <SummaryCard label="Upcoming Tasks" value={totalUpcomingTasks} icon={Clock3} />
          </div>
        </section>

        <CampaignSection
          title="Ongoing Campaigns"
          subtitle="Already active or currently inside their scheduled run window."
          campaigns={ongoingCampaigns}
          emptyTitle="No ongoing campaigns"
          emptyDescription="Campaigns marked active or currently running by date will appear here."
        />

        <CampaignSection
          title="Upcoming Campaigns"
          subtitle="Planned campaigns that have not started yet or are still being staged."
          campaigns={upcomingCampaigns}
          emptyTitle="No upcoming campaigns"
          emptyDescription="Future-dated or planning-stage campaigns will appear here."
        />
      </div>
    </div>
  );
}

function CampaignSection({
  title,
  subtitle,
  campaigns,
  emptyTitle,
  emptyDescription,
}: {
  title: string;
  subtitle: string;
  campaigns: ReturnType<typeof normalizeOpsCampaigns>;
  emptyTitle: string;
  emptyDescription: string;
}) {
  return (
    <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{title}</h2>
          <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
        </div>
        <div className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500 dark:bg-zinc-900 dark:text-zinc-300">
          {campaigns.length} campaigns
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="mt-6 rounded-[1.75rem] border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100">{emptyTitle}</h3>
          <p className="mt-2 text-sm text-zinc-500">{emptyDescription}</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {campaigns.map((campaign) => {
            const progress = getCampaignProgress(campaign);
            const daysUntilStart = getDaysFromToday(campaign.startDate);
            const daysUntilEnd = getDaysFromToday(campaign.endDate);

            return (
              <article
                key={campaign.id}
                className="rounded-[1.75rem] border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-xl font-black text-zinc-900 dark:text-zinc-100">{campaign.name}</h3>
                      <Badge>{campaign.status}</Badge>
                      <MutedBadge>{campaign.currentPhase}</MutedBadge>
                    </div>
                    <p className="mt-2 text-sm text-zinc-500">
                      {campaign.client || 'No client set'} · {campaign.market} · {campaign.owner || 'No owner assigned'}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white px-4 py-3 text-right dark:bg-zinc-950">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Progress</p>
                    <p className="mt-1 text-2xl font-black text-zinc-900 dark:text-zinc-100">{progress.completionRate}%</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <InfoTile
                    label="Start Date"
                    value={formatDate(campaign.startDate)}
                    helper={
                      daysUntilStart === null
                        ? 'Needs scheduling'
                        : daysUntilStart > 0
                        ? `Starts in ${daysUntilStart} days`
                        : daysUntilStart === 0
                        ? 'Starts today'
                        : `Started ${Math.abs(daysUntilStart)} days ago`
                    }
                  />
                  <InfoTile
                    label="End Date"
                    value={formatDate(campaign.endDate)}
                    helper={
                      daysUntilEnd === null
                        ? 'Open-ended'
                        : daysUntilEnd > 0
                        ? `${daysUntilEnd} days left`
                        : daysUntilEnd === 0
                        ? 'Ends today'
                        : `Ended ${Math.abs(daysUntilEnd)} days ago`
                    }
                  />
                  <InfoTile
                    label="Task Coverage"
                    value={`${progress.done}/${progress.total} done`}
                    helper={`${campaign.teamPlans.length} teams in plan`}
                  />
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                    <span>Completion</span>
                    <span>{progress.completionRate}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white dark:bg-black">
                    <div
                      className="h-2 rounded-full bg-zinc-900 transition-all dark:bg-zinc-100"
                      style={{ width: `${progress.completionRate}%` }}
                    />
                  </div>
                </div>

                {campaign.notes && (
                  <div className="mt-5 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                    {campaign.notes}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-[1.75rem] border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-zinc-400">{label}</p>
        <Icon className="h-5 w-5 text-zinc-500" />
      </div>
      <p className="mt-4 text-3xl font-black text-zinc-900 dark:text-zinc-100">{value}</p>
    </div>
  );
}

function InfoTile({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{label}</p>
      <p className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{helper}</p>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-zinc-900 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white dark:bg-zinc-100 dark:text-black">
      {children}
    </span>
  );
}

function MutedBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
      {children}
    </span>
  );
}
