import React, { useContext, useState } from 'react';
import { CheckCircle, ArrowRight, Zap, BarChart3, Users, Inbox, Play, Loader2 } from 'lucide-react';
import { AppContext } from '../Root';

export function PlatformDemo() {
  const ctx = useContext(AppContext);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      title: 'Welcome to TRYGC',
      description: 'Your operational dashboard for task management, campaigns, and team coordination',
      icon: Zap,
      features: ['Real-time task tracking', 'Campaign management', 'Team coordination'],
    },
    {
      title: 'Create & Manage Tasks',
      description: 'Organize work into tasks with subtasks, priorities, and team assignments',
      icon: Inbox,
      features: ['Bulk XLSX upload', 'Auto-categorization', 'Subtask hierarchy'],
    },
    {
      title: 'Track Campaigns',
      description: 'Plan and execute marketing campaigns with lifecycle management',
      icon: Zap,
      features: ['Campaign tracking', 'Timeline management', 'Success logging'],
    },
    {
      title: 'Team Coordination',
      description: 'Coordinate with your team through assignments and shared workspaces',
      icon: Users,
      features: ['Assign work', 'Team views', 'Coverage tracking'],
    },
    {
      title: 'Analytics & Insights',
      description: 'Visualize performance metrics and team velocity',
      icon: BarChart3,
      features: ['Task completion rates', 'Team velocity', 'Performance trends'],
    },
  ];

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Mark demo as completed
      if (ctx?.setDemoCompleted) {
        ctx.setDemoCompleted(true);
      }
    } catch (err) {
      console.error('Error completing demo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-zinc-50 dark:from-black dark:to-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all ${
                  idx <= currentStep
                    ? 'bg-black dark:bg-white'
                    : 'bg-zinc-200 dark:bg-zinc-800'
                }`}
                style={{ flex: idx <= currentStep ? 1.5 : 1 }}
              />
            ))}
          </div>
          <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-100 dark:border-zinc-800 p-12">
          {/* Icon */}
          <div className="w-20 h-20 bg-black dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Icon className="w-10 h-10 text-white dark:text-black" />
          </div>

          {/* Content */}
          <h1 className="text-4xl font-black text-black dark:text-white text-center mb-3">{step.title}</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300 text-center mb-8">{step.description}</p>

          {/* Features List */}
          <div className="space-y-3 mb-10">
            {step.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-black dark:text-white font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0 || isLoading}
              className="px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-bold rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            <div className="flex-1" />

            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleComplete}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Get Started
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:shadow-lg transition-all"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
