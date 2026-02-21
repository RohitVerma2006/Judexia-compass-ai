
-- Create forum posts table for shared community
CREATE TABLE public.forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  author_name text NOT NULL DEFAULT '',
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  upvotes integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can read all posts
CREATE POLICY "Anyone can read forum posts"
  ON public.forum_posts FOR SELECT TO authenticated
  USING (true);

-- Users can create their own posts
CREATE POLICY "Users can create forum posts"
  ON public.forum_posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update own posts (for upvotes we'll use a separate mechanism)
CREATE POLICY "Users can update own posts"
  ON public.forum_posts FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Allow anyone authenticated to upvote (update upvotes)
CREATE POLICY "Anyone can upvote posts"
  ON public.forum_posts FOR UPDATE TO authenticated
  USING (true);

-- Forum comments
CREATE TABLE public.forum_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  author_name text NOT NULL DEFAULT '',
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments"
  ON public.forum_comments FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON public.forum_comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime for forum
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_comments;
