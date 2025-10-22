import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
    if (!adminLoading && !isAdmin && user) {
      navigate('/dashboard');
    }
  }, [user, authLoading, isAdmin, adminLoading, navigate]);

  const { data: profiles, isLoading: loadingProfiles } = useQuery({
    queryKey: ['all-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: userRoles } = useQuery({
    queryKey: ['all-user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');

      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: imageAnalyses, isLoading: loadingAnalyses } = useQuery({
    queryKey: ['all-image-analyses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('image_analyses')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email,
            profile_picture
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  if (authLoading || adminLoading) {
    return <LoadingSpinner message="Checking permissions..." />;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users and monitor image analyses</p>
          </div>

          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="analyses">Image Analyses</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>
                    View and manage all registered users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingProfiles ? (
                    <LoadingSpinner message="Loading users..." />
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {profiles?.map((profile) => {
                            const role = userRoles?.find((r) => r.user_id === profile.id);
                            return (
                              <TableRow key={profile.id}>
                                <TableCell className="flex items-center gap-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={profile.profile_picture || undefined} />
                                    <AvatarFallback>
                                      {profile.first_name?.[0]}{profile.last_name?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>
                                    {profile.first_name} {profile.last_name}
                                  </span>
                                </TableCell>
                                <TableCell>{profile.email}</TableCell>
                                <TableCell>
                                  <Badge variant={role?.role === 'admin' ? 'default' : 'secondary'}>
                                    {role?.role || 'user'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {new Date(profile.created_at).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analyses">
              <Card>
                <CardHeader>
                  <CardTitle>Image Analyses</CardTitle>
                  <CardDescription>
                    View all uploaded images and their classification results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingAnalyses ? (
                    <LoadingSpinner message="Loading analyses..." />
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Confidence</TableHead>
                            <TableHead>Material</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {imageAnalyses?.map((analysis: any) => (
                            <TableRow key={analysis.id}>
                              <TableCell className="flex items-center gap-2">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={analysis.profiles?.profile_picture || undefined} />
                                  <AvatarFallback>
                                    {analysis.profiles?.first_name?.[0]}{analysis.profiles?.last_name?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">
                                    {analysis.profiles?.first_name} {analysis.profiles?.last_name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {analysis.profiles?.email}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <img 
                                  src={analysis.image_url} 
                                  alt="Analyzed item" 
                                  className="w-16 h-16 object-cover rounded"
                                />
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    analysis.category === 'recyclable' ? 'default' : 
                                    analysis.category === 'reusable' ? 'secondary' : 
                                    'destructive'
                                  }
                                >
                                  {analysis.category}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className="font-semibold text-primary">
                                  {(analysis.confidence * 100).toFixed(1)}%
                                </span>
                              </TableCell>
                              <TableCell className="text-sm">
                                {analysis.material || 'N/A'}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(analysis.created_at).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {imageAnalyses?.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No image analyses yet
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
