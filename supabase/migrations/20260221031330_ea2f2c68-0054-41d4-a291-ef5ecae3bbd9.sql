
-- Fix: Remove duplicate permissive update policy on forum_posts (keep only owner update)
DROP POLICY "Anyone can upvote posts" ON public.forum_posts;

-- Create a function for upvoting that bypasses RLS
CREATE OR REPLACE FUNCTION public.upvote_forum_post(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.forum_posts SET upvotes = upvotes + 1 WHERE id = post_id;
END;
$$;
