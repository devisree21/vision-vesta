import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  TrendingUp,
  Target,
  PieChart,
  Plus,
  Settings,
  User,
  Shield,
  Moon,
  Sun,
  Search,
  X,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  CreditCard,
} from 'lucide-react';
import Chart from 'chart.js/auto';
import { SummaryCard } from './SummaryCard';
import { GoalCard } from './GoalCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface Budget {
  category: string;
  amount: number;
  spent: number;
}

interface Goal {
  id: number;
  name: string;
  target: number;
  saved: number;
  deadline: string;
}

export const FinancialDashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([
    { category: 'Food & Drink', amount: 200, spent: 0 },
    { category: 'Transportation', amount: 100, spent: 0 },
    { category: 'Entertainment', amount: 50, spent: 0 },
    { category: 'Education', amount: 150, spent: 0 },
    { category: 'Utilities', amount: 80, spent: 0 },
  ]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'goals' | 'transactions'>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ description: '', amount: '' });
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '' });
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const totalSpent = transactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  const monthlyBudget = budgets.reduce((sum, b) => sum + Number(b.amount || 0), 0);
  const remainingBudget = monthlyBudget - totalSpent;

  const categorizeExpense = (description: string): string => {
    const desc = description.toLowerCase();
    if (desc.match(/coffee|cafe|restaurant|food|groceries/)) return 'Food & Drink';
    if (desc.match(/bus|train|metro|transport|taxi/)) return 'Transportation';
    if (desc.match(/movie|stream|game|concert|entertainment/)) return 'Entertainment';
    if (desc.match(/book|tuition|university|course|education/)) return 'Education';
    if (desc.match(/rent|electric|water|internet|utilities/)) return 'Utilities';
    return 'Other';
  };

  const updateBudget = (category: string, amount: number) => {
    setBudgets(prev => prev.map(b => 
      b.category === category ? { ...b, spent: b.spent + amount } : b
    ));
  };

  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount) return;
    
    const amountNum = parseFloat(newTransaction.amount);
    const category = categorizeExpense(newTransaction.description);
    const transaction: Transaction = {
      id: transactions.length + 1,
      description: newTransaction.description,
      amount: amountNum,
      date: new Date().toISOString().split('T')[0],
      category,
    };
    
    setTransactions(prev => [...prev, transaction]);
    updateBudget(category, amountNum);
    setNewTransaction({ description: '', amount: '' });
  };

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.target || !newGoal.deadline) return;
    
    const goal: Goal = {
      id: goals.length + 1,
      name: newGoal.name,
      target: parseFloat(newGoal.target),
      saved: 0,
      deadline: newGoal.deadline,
    };
    
    setGoals(prev => [...prev, goal]);
    setNewGoal({ name: '', target: '', deadline: '' });
  };

  useEffect(() => {
    if (!chartRef.current) return;
    
    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const data = {
      labels: budgets.map(b => b.category),
      datasets: [{
        label: 'Budget Spent',
        data: budgets.map(b => b.spent),
        backgroundColor: [
          'hsl(262 83% 58%)',
          'hsl(142 76% 36%)', 
          'hsl(45 93% 47%)',
          'hsl(0 84% 60%)',
          'hsl(320 91% 65%)'
        ],
        borderWidth: 0,
      }]
    };

    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [budgets, transactions]);

  const TabButton = ({ tab, label, isActive, onClick }: {
    tab: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      onClick={onClick}
      className={cn(
        "flex-1 transition-all duration-300",
        isActive 
          ? "bg-gradient-primary text-white shadow-medium" 
          : "hover:bg-secondary"
      )}
    >
      {label}
    </Button>
  );

  return (
    <div className={cn(
      "min-h-screen flex flex-col transition-colors duration-300",
      darkMode ? "bg-background" : "bg-gradient-secondary"
    )}>
      {/* Header */}
      <header className="flex items-center justify-between p-6 shadow-medium bg-gradient-primary text-white">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8" />
          <h1 className="text-3xl font-bold tracking-wide">FinSmart</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="text-white hover:bg-white/20 transition-colors duration-300"
          >
            {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </Button>
          <User className="h-6 w-6" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-2">
          <TabButton
            tab="dashboard"
            label="Dashboard"
            isActive={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <TabButton
            tab="goals"
            label="Goals"
            isActive={activeTab === 'goals'}
            onClick={() => setActiveTab('goals')}
          />
          <TabButton
            tab="transactions"
            label="Transactions"
            isActive={activeTab === 'transactions'}
            onClick={() => setActiveTab('transactions')}
          />
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SummaryCard
                title="Total Budget"
                amount={monthlyBudget}
                icon={DollarSign}
                variant="primary"
              />
              <SummaryCard
                title="Total Spent"
                amount={totalSpent}
                icon={CreditCard}
                variant="danger"
              />
              <SummaryCard
                title="Remaining"
                amount={remainingBudget}
                icon={CheckCircle}
                variant="success"
              />
            </div>

            {/* Charts */}
            <div className="bg-card rounded-xl shadow-soft p-6 border border-border">
              <h3 className="text-xl font-semibold mb-4 text-card-foreground">Spending by Category</h3>
              <div className="w-full h-64 flex items-center justify-center">
                <canvas ref={chartRef} />
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Savings Goals</h2>
            </div>
            
            <div className="space-y-4">
              {goals.map(goal => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>

            {/* Add Goal Form */}
            <div className="bg-card rounded-xl shadow-soft p-6 border border-border">
              <h3 className="text-lg font-semibold mb-4 text-card-foreground">Add New Goal</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="Goal Name"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Target Amount"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                  className="flex-1"
                />
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddGoal}
                  className="bg-gradient-primary text-white shadow-medium hover:shadow-strong transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Transactions</h2>
            </div>

            {/* Add Transaction Form */}
            <div className="bg-card rounded-xl shadow-soft p-6 border border-border">
              <h3 className="text-lg font-semibold mb-4 text-card-foreground">Add New Transaction</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="Description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddTransaction}
                  className="bg-gradient-primary text-white shadow-medium hover:shadow-strong transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </div>
            </div>

            {/* Transaction List */}
            <div className="bg-card rounded-xl shadow-soft border border-border overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-card-foreground">Recent Transactions</h3>
              </div>
              <div className="divide-y divide-border">
                {transactions.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    No transactions yet. Add your first transaction above!
                  </div>
                ) : (
                  transactions.slice().reverse().map(transaction => (
                    <div key={transaction.id} className="p-4 flex justify-between items-center hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium text-card-foreground">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.category} • {transaction.date}</p>
                      </div>
                      <p className="font-semibold text-lg text-destructive">-${transaction.amount.toFixed(2)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};