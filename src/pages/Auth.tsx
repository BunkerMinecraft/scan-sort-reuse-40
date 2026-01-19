import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/logo.png';
import { z } from 'zod';
import { Link } from 'react-router-dom';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const signUpSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(50),
  lastName: z.string().trim().min(1, 'Last name is required').max(50),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signInSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const Auth = () => {
  const { signUp, signIn, signInWithGoogle } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Sign up state
  const [signUpData, setSignUpData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [signUpErrors, setSignUpErrors] = useState<Record<string, string>>({});
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);

  // Sign in state
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });
  const [signInErrors, setSignInErrors] = useState<Record<string, string>>({});
  const [isSignInLoading, setIsSignInLoading] = useState(false);

  // Check for saved "remember me" preference
  useEffect(() => {
    const savedRememberMe = localStorage.getItem('neurec_remember_me');
    if (savedRememberMe === 'true') {
      setRememberMe(true);
    }
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpErrors({});
    
    try {
      signUpSchema.parse(signUpData);
      setIsSignUpLoading(true);
      
      await signUp(
        signUpData.email,
        signUpData.password,
        signUpData.firstName,
        signUpData.lastName
      );
      
      setSignUpData({ firstName: '', lastName: '', email: '', password: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setSignUpErrors(errors);
      }
    } finally {
      setIsSignUpLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInErrors({});
    
    try {
      signInSchema.parse(signInData);
      setIsSignInLoading(true);
      
      await signIn(signInData.email, signInData.password, rememberMe);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setSignInErrors(errors);
      }
    } finally {
      setIsSignInLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-soft">
        <div className="flex items-center justify-center gap-2 mb-8">
          <img src={logo} alt="Neurec AI" className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Neurec AI</h1>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  placeholder="your@email.com"
                />
                {signInErrors.email && (
                  <p className="text-sm text-destructive">{signInErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  placeholder="••••••••"
                />
                {signInErrors.password && (
                  <p className="text-sm text-destructive">{signInErrors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <Label htmlFor="remember-me" className="text-sm font-normal cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSignInLoading}
              >
                {isSignInLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={async () => {
                  setIsGoogleLoading(true);
                  await signInWithGoogle();
                  setIsGoogleLoading(false);
                }}
                disabled={isGoogleLoading}
              >
                <GoogleIcon />
                <span className="ml-2">{isGoogleLoading ? 'Connecting...' : 'Continue with Google'}</span>
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-firstname">First Name</Label>
                <Input
                  id="signup-firstname"
                  type="text"
                  value={signUpData.firstName}
                  onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                  placeholder="John"
                />
                {signUpErrors.firstName && (
                  <p className="text-sm text-destructive">{signUpErrors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-lastname">Last Name</Label>
                <Input
                  id="signup-lastname"
                  type="text"
                  value={signUpData.lastName}
                  onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                  placeholder="Doe"
                />
                {signUpErrors.lastName && (
                  <p className="text-sm text-destructive">{signUpErrors.lastName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  placeholder="your@email.com"
                />
                {signUpErrors.email && (
                  <p className="text-sm text-destructive">{signUpErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  placeholder="••••••••"
                />
                {signUpErrors.password && (
                  <p className="text-sm text-destructive">{signUpErrors.password}</p>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                By signing up, you'll receive a verification email to confirm your account.
              </p>

              <Button
                type="submit"
                className="w-full"
                disabled={isSignUpLoading}
              >
                {isSignUpLoading ? 'Creating account...' : 'Sign Up'}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={async () => {
                  setIsGoogleLoading(true);
                  await signInWithGoogle();
                  setIsGoogleLoading(false);
                }}
                disabled={isGoogleLoading}
              >
                <GoogleIcon />
                <span className="ml-2">{isGoogleLoading ? 'Connecting...' : 'Continue with Google'}</span>
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
