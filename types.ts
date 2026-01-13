
export interface AppIdea {
  id: string;
  title: string;
  problem: string;
  solution: string;
  target: string;
  monetization: 'One-time' | 'Subscription' | 'Usage-based';
  icon: string;
}

export interface ChecklistItem {
  day: number;
  title: string;
  description: string;
  tasks: string[];
  isCompleted: boolean;
}

export type PDCAStatus = 'P' | 'D' | 'C' | 'A' | 'None';

export type View = 'dashboard' | 'ideas' | 'checklist' | 'autopilot' | 'gantt' | 'schema';
