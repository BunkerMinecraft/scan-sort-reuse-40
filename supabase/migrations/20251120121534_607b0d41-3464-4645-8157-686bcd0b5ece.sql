-- Add UPDATE and DELETE policies for image_analyses table
-- This allows users to manage their own analysis records

CREATE POLICY "Users can update their own analyses"
ON public.image_analyses
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
ON public.image_analyses
FOR DELETE
USING (auth.uid() = user_id);