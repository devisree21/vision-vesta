import { Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Goal {
  id: number;
  name: string;
  target: number;
  saved: number;
  deadline: string;
}

interface GoalCardProps {
  goal: Goal;
}

export const GoalCard = ({ goal }: GoalCardProps) => {
  const progress = Math.min((goal.saved / goal.target) * 100, 100);
  
  const getProgressVariant = (progress: number) => {
    if (progress < 50) return 'bg-gradient-danger';
    if (progress < 80) return 'bg-gradient-warning';
    return 'bg-gradient-success';
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4 bg-card rounded-xl shadow-soft p-6 hover:shadow-medium transition-all duration-300 border border-border">
      <div className="p-3 bg-gradient-primary rounded-full flex items-center justify-center shadow-soft">
        <Target className="h-6 w-6 text-white" />
      </div>
      <div className="flex-1 w-full">
        <h4 className="font-semibold text-lg tracking-wide text-card-foreground">{goal.name}</h4>
        <p className="text-sm text-muted-foreground mt-1">Deadline: {goal.deadline}</p>
        <div className="w-full h-3 bg-muted rounded-full mt-3 overflow-hidden">
          <div 
            className={cn("h-3 rounded-full transition-all duration-500", getProgressVariant(progress))} 
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm mt-2 text-muted-foreground">
          Saved ${goal.saved.toFixed(2)} of ${goal.target.toFixed(2)} ({progress.toFixed(1)}%)
        </p>
      </div>
    </div>
  );
};