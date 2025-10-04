import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserIcon, MailIcon, CalendarIcon, AwardIcon } from 'lucide-react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account and view your sustainability achievements
            </p>
          </div>

          {/* Profile Card */}
          <Card className="p-6 shadow-soft">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-primary" />
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Guest User</h2>
                  <p className="text-muted-foreground">Eco Warrior</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MailIcon className="w-4 h-4" />
                    <span>guest@ecoscan.app</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Joined {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
                
                <Button variant="outline">Edit Profile</Button>
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-6 shadow-soft">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <AwardIcon className="w-6 h-6 text-primary" />
              Achievements
            </h2>
            <div className="text-center py-12 text-muted-foreground">
              <p>Start analyzing items to unlock achievements!</p>
            </div>
          </Card>

          {/* Sustainability Stats */}
          <Card className="p-6 shadow-soft bg-gradient-eco text-white">
            <h2 className="text-2xl font-semibold mb-4">Your Sustainability Journey</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-white/80 text-sm mb-1">Current Streak</p>
                <p className="text-3xl font-bold">0 days</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Items Classified</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Environmental Score</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Community Rank</p>
                <p className="text-3xl font-bold">-</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
