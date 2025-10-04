import { Card } from '@/components/ui/card';
import { RecycleIcon, TrashIcon, PackageIcon, TrendingUpIcon } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      label: 'Items Recycled',
      value: '0',
      icon: RecycleIcon,
      color: 'text-recyclable',
      bgColor: 'bg-recyclable/20',
    },
    {
      label: 'Items Reused',
      value: '0',
      icon: PackageIcon,
      color: 'text-reusable',
      bgColor: 'bg-reusable/20',
    },
    {
      label: 'Trash Items',
      value: '0',
      icon: TrashIcon,
      color: 'text-trash',
      bgColor: 'bg-trash/20',
    },
    {
      label: 'Total Analyzed',
      value: '0',
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
            {stats.map((stat) => {
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
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
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
              <p>No items analyzed yet. Start by analyzing your first item!</p>
            </div>
          </Card>

          {/* Impact Summary */}
          <Card className="p-6 shadow-soft bg-gradient-eco text-white">
            <h2 className="text-2xl font-semibold mb-4">Your Environmental Impact</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-white/80 text-sm mb-1">CO₂ Saved</p>
                <p className="text-3xl font-bold">0 kg</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Waste Diverted</p>
                <p className="text-3xl font-bold">0 kg</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Trees Saved</p>
                <p className="text-3xl font-bold">0</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
