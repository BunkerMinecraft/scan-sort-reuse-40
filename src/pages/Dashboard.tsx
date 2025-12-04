import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { RecycleIcon, TrashIcon, PackageIcon, TrendingUpIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface DashboardStats {
  itemsRecycled: number;
  itemsReused: number;
  trashItems: number;
  totalAnalyzed: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    itemsRecycled: 0,
    itemsReused: 0,
    trashItems: 0,
    totalAnalyzed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('image_analyses')
        .select('category')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching analyses:', error);
        setLoading(false);
        return;
      }

      const counts = data.reduce(
        (acc, item) => {
          acc.totalAnalyzed++;
          const category = item.category?.toLowerCase();
          
          if (category === 'trash' || category === 'biological') {
            acc.trashItems++;
          } else if (category === 'reusable') {
            acc.itemsReused++;
          } else {
            // recyclable and other categories
            acc.itemsRecycled++;
          }
          return acc;
        },
        { itemsRecycled: 0, itemsReused: 0, trashItems: 0, totalAnalyzed: 0 }
      );

      setStats(counts);
      setLoading(false);
    };

    fetchStats();
  }, [user]);

  const statCards = [
    {
      label: 'Items Recycled',
      value: stats.itemsRecycled.toString(),
      icon: RecycleIcon,
      color: 'text-recyclable',
      bgColor: 'bg-recyclable/20',
    },
    {
      label: 'Items Reused',
      value: stats.itemsReused.toString(),
      icon: PackageIcon,
      color: 'text-reusable',
      bgColor: 'bg-reusable/20',
    },
    {
      label: 'Trash Items',
      value: stats.trashItems.toString(),
      icon: TrashIcon,
      color: 'text-trash',
      bgColor: 'bg-trash/20',
    },
    {
      label: 'Total Analyzed',
      value: stats.totalAnalyzed.toString(),
      icon: TrendingUpIcon,
      color: 'text-primary',
      bgColor: 'bg-primary/20',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Track your environmental impact and waste classification history
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className="p-6 shadow-soft hover:shadow-glow transition-all duration-300"
                >
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
                </Card>
              );
            })}
          </div>

          {/* Recent Activity */}
          <Card className="p-6 shadow-soft">
            <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
            <div className="text-center py-12 text-muted-foreground">
              {stats.totalAnalyzed === 0 ? (
                <p>No items analyzed yet. Start by analyzing your first item!</p>
              ) : (
                <p>You have analyzed {stats.totalAnalyzed} items so far!</p>
              )}
            </div>
          </Card>

          {/* Impact Summary */}
          <Card className="p-6 shadow-soft bg-gradient-eco text-white">
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
