import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/logo.png';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
});

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      emailSchema.parse({ email });
      setIsLoading(true);
      
      const { error } = await resetPassword(email);
      if (!error) {
        setIsSubmitted(true);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || 'Invalid email');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-soft text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <img src={logo} alt="Neurec AI" className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Neurec AI</h1>
          </div>

          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-xl font-semibold mb-2">Check your email</h2>
          <p className="text-muted-foreground mb-6">
            We sent a password reset link to <strong>{email}</strong>
          </p>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setIsSubmitted(false);
              setEmail('');
            }}
          >
            Try another email
          </Button>

          <div className="mt-6">
            <Link to="/auth" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-soft">
        <div className="flex items-center justify-center gap-2 mb-8">
          <img src={logo} alt="Neurec AI" className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Neurec AI</h1>
        </div>

        <h2 className="text-xl font-semibold text-center mb-2">Forgot Password?</h2>
        <p className="text-muted-foreground text-center mb-6">
          No worries, we'll send you reset instructions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Reset Password'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/auth" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;