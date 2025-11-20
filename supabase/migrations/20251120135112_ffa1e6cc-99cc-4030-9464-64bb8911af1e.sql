-- Add DELETE policy for profiles table to allow users to delete their own profiles
-- This is required for GDPR compliance and user data deletion rights

CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = id);