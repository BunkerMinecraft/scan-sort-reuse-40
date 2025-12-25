import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecycleIcon, TrashIcon, PackageIcon, TrendingUpIcon, InfoIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import { startOfWeek, endOfWeek, addWeeks, subWeeks, format, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';

interface DashboardStats {
  itemsRecycled: number;
  itemsReused: number;
  trashItems: number;
  totalAnalyzed: number;
}

interface AnalysisRecord {
  created_at: string;
}

interface WeeklyData {
  day: string;
  count: number;
}
const Dashboard = () => {
  const {
    user
  } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    itemsRecycled: 0,
    itemsReused: 0,
    trashItems: 0,
    totalAnalyzed: 0
  });
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const {
        data,
        error
      } = await supabase.from('image_analyses').select('category, created_at').eq('user_id', user.id);
      if (error) {
        console.error('Error fetching analyses:', error);
        setLoading(false);
        return;
      }
      const counts = data.reduce((acc, item) => {
        acc.totalAnalyzed++;
        const category = item.category?.toLowerCase();
        if (category === 'trash' || category === 'biological') {
          acc.trashItems++;
        } else if (category === 'reusable') {
          acc.itemsReused++;
        } else {
          acc.itemsRecycled++;
        }
        return acc;
      }, {
        itemsRecycled: 0,
        itemsReused: 0,
        trashItems: 0,
        totalAnalyzed: 0
      });
      setStats(counts);
      setAnalyses(data.map(d => ({ created_at: d.created_at })));
      setLoading(false);
    };
    fetchStats();
  }, [user]);

  const getWeeklyData = (): WeeklyData[] => {
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });
    
    return days.map(day => {
      const count = analyses.filter(a => isSameDay(parseISO(a.created_at), day)).length;
      return {
        day: format(day, 'EEE'),
        count
      };
    });
  };

  const chartConfig = {
    count: {
      label: 'Items Analyzed',
      color: 'hsl(var(--primary))'
    }
  };

  const goToPreviousWeek = () => setCurrentWeekStart(prev => subWeeks(prev, 1));
  const goToNextWeek = () => setCurrentWeekStart(prev => addWeeks(prev, 1));
  const statCards = [{
    label: 'Items Recycled',
    value: stats.itemsRecycled.toString(),
    icon: RecycleIcon,
    color: 'text-recyclable',
    bgColor: 'bg-recyclable/20'
  }, {
    label: 'Items Reused',
    value: stats.itemsReused.toString(),
    icon: PackageIcon,
    color: 'text-reusable',
    bgColor: 'bg-reusable/20'
  }, {
    label: 'Trash Items',
    value: stats.trashItems.toString(),
    icon: TrashIcon,
    color: 'text-trash',
    bgColor: 'bg-trash/20'
  }, {
    label: 'Total Analyzed',
    value: stats.totalAnalyzed.toString(),
    icon: TrendingUpIcon,
    color: 'text-primary',
    bgColor: 'bg-primary/20'
  }];
  return <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Track your environmental impact and waste classification history
            </p>
          </div>

          {!user && <Alert className="border-primary/30 bg-primary/5 border">
              <InfoIcon className="h-4 w-4 text-primary" />
              <AlertDescription className="text-muted-foreground">
                You're viewing as a guest. Stats won't be tracked.{' '}
                <Link to="/auth" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>{' '}
                to save your progress and track your environmental impact!
              </AlertDescription>
            </Alert>}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map(stat => {
            const Icon = stat.icon;
            return <Card key={stat.label} className="p-6 shadow-soft hover:shadow-glow transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">
                        {loading ? '...' : stat.value}
                      </p>
                    </div>
                  </div>
                </Card>;
          })}
          </div>

          {/* Recent Activity */}
          <Card className="p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Recent Activity</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground min-w-[140px] text-center">
                  {format(currentWeekStart, 'MMM d')} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMM d, yyyy')}
                </span>
                <Button variant="outline" size="icon" onClick={goToNextWeek}>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {!user ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Sign in to track your activity</p>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart data={getWeeklyData()}>
                  <defs>
                    <linearGradient id="ecoGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(142, 76%, 50%)" />
                      <stop offset="100%" stopColor="hsl(142, 76%, 36%)" />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="url(#ecoGradient)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </Card>

          {/* Impact Summary */}
          <Card className="p-6 bg-gradient-eco text-white shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4">Your Environmental Impact</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-white/80 text-sm mb-1">CO₂ Saved</p>
                <p className="text-3xl font-bold">{(stats.itemsRecycled * 0.5).toFixed(1)} kg</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Waste Diverted</p>
                <p className="text-3xl font-bold">{(stats.itemsRecycled * 0.2).toFixed(1)} kg</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Trees Saved</p>
                <p className="text-3xl font-bold">{Math.floor(stats.itemsRecycled / 10)}</p>
              </div>
            </div>
          </Card>

          {/* Impact Calculation Note */}
          <Card className="p-4 border-muted">
            <div className="flex items-start gap-3">
              <InfoIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-2">How we calculate your impact:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li><span className="font-medium">CO₂ Saved:</span> 0.5 kg per recycled item (average emissions prevented by recycling vs. landfill)</li>
                  <li><span className="font-medium">Waste Diverted:</span> 0.2 kg per recycled item (average weight of recyclable materials kept out of landfills)</li>
                  <li><span className="font-medium">Trees Saved:</span> 1 tree per 10 recycled items (based on paper/cardboard recycling impact)</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>;
};
export default Dashboard;