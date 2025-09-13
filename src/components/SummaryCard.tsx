import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  variant: 'primary' | 'success' | 'warning' | 'danger';
}

const variantStyles = {
  primary: 'bg-gradient-primary',
  success: 'bg-gradient-success', 
  warning: 'bg-gradient-warning',
  danger: 'bg-gradient-danger',
};

export const SummaryCard = ({ title, amount, icon: Icon, variant }: SummaryCardProps) => (
  <div className={cn(
    "flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4 rounded-xl shadow-medium p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-strong",
    variantStyles[variant]
  )}>
    <div className="p-4 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center shadow-soft">
      <Icon className="h-10 w-10" />
    </div>
    <div className="flex flex-col text-center md:text-left">
      <h3 className="text-lg font-semibold tracking-wide">{title}</h3>
      <p className="text-3xl font-bold mt-1">${Number(amount || 0).toFixed(2)}</p>
    </div>
  </div>
);