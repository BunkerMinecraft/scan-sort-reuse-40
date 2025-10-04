import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserIcon, MailIcon, CalendarIcon, AwardIcon, CameraIcon, Loader2Icon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { z } from 'zod';

const profileSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(50),
  lastName: z.string().trim().min(1, 'Last name is required').max(50),
});

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: null as string | null,
    createdAt: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ firstName: '', lastName: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (data) {
      setProfile({
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        profilePicture: data.profile_picture,
        createdAt: data.created_at,
      });
      setEditData({
        firstName: data.first_name,
        lastName: data.last_name,
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      profileSchema.parse(editData);
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: editData.firstName,
          last_name: editData.lastName,
        })
        .eq('id', user?.id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setErrors(errors);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update profile',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Delete old image if exists
      if (profile.profilePicture) {
        const oldPath = profile.profilePicture.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${oldPath}`]);
        }
      }
      
      // Upload new image
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_picture: publicUrl })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: 'Success',
        description: 'Profile picture updated',
      });
      
      fetchProfile();
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload profile picture',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePicture = async () => {
    if (!user || !profile.profilePicture) return;
    
    setIsUploading(true);
    
    try {
      const oldPath = profile.profilePicture.split('/').pop();
      if (oldPath) {
        await supabase.storage
          .from('avatars')
          .remove([`${user.id}/${oldPath}`]);
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({ profile_picture: null })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Profile picture removed',
      });
      
      fetchProfile();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove profile picture',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return null;

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
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.profilePicture || undefined} />
                  <AvatarFallback className="bg-primary/20 text-2xl">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                  ) : (
                    <CameraIcon className="w-4 h-4" />
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              
              <div className="flex-1 space-y-4">
                {!isEditing ? (
                  <>
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground">
                        {profile.firstName} {profile.lastName}
                      </h2>
                      <p className="text-muted-foreground">Eco Warrior</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MailIcon className="w-4 h-4" />
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                      {profile.profilePicture && (
                        <Button
                          variant="outline"
                          onClick={handleDeletePicture}
                          disabled={isUploading}
                        >
                          Remove Picture
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={editData.firstName}
                        onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive">{errors.firstName}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={editData.lastName}
                        onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive">{errors.lastName}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setEditData({
                            firstName: profile.firstName,
                            lastName: profile.lastName,
                          });
                          setErrors({});
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
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
