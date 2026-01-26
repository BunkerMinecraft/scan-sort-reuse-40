CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _first_name text;
  _last_name text;
BEGIN
  -- Try to get first_name from raw_user_meta_data (email/password signup)
  -- or given_name from Google OAuth
  _first_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'first_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'given_name', ''),
    split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''), ' ', 1),
    'User'
  );
  
  -- Try to get last_name from raw_user_meta_data (email/password signup)
  -- or family_name from Google OAuth
  _last_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'last_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'family_name', ''),
    NULLIF(split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''), ' ', 2), ''),
    ''
  );

  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    _first_name,
    _last_name,
    NEW.email
  );
  RETURN NEW;
END;
$function$;