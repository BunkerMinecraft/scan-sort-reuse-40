-- Create table for image analyses
CREATE TABLE public.image_analyses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    image_url text NOT NULL,
    category text NOT NULL,
    confidence numeric NOT NULL,
    material text,
    recommendations text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.image_analyses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own analyses"
ON public.image_analyses
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses"
ON public.image_analyses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all analyses"
ON public.image_analyses
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create index for better performance
CREATE INDEX idx_image_analyses_user_id ON public.image_analyses(user_id);
CREATE INDEX idx_image_analyses_created_at ON public.image_analyses(created_at DESC);