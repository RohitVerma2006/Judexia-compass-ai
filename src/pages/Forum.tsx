import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, MessageCircle, Plus, Loader2 } from 'lucide-react';

interface Post {
  id: string;
  user_id: string;
  author_name: string;
  title: string;
  body: string;
  upvotes: number;
  created_at: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export default function Forum() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    const { data: postsData } = await supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (postsData) {
      // Fetch comments for all posts
      const postIds = postsData.map((p: any) => p.id);
      const { data: commentsData } = await supabase
        .from('forum_comments')
        .select('*')
        .in('post_id', postIds.length ? postIds : ['none'])
        .order('created_at', { ascending: true });

      const postsWithComments = postsData.map((p: any) => ({
        ...p,
        comments: (commentsData || []).filter((c: any) => c.post_id === p.id),
      }));
      setPosts(postsWithComments);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();

    // Real-time subscription
    const channel = supabase
      .channel('forum-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_posts' }, () => fetchPosts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_comments' }, () => fetchPosts())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleUpvote = async (id: string) => {
    await supabase.rpc('upvote_forum_post', { post_id: id });
    setPosts(prev => prev.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
  };

  const handleComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text?.trim() || !user) return;
    await supabase.from('forum_comments').insert({
      post_id: postId,
      user_id: user.id,
      author_name: user.fullName,
      content: text,
    });
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleCreate = async () => {
    if (!newTitle.trim() || !user) return;
    setSubmitting(true);
    await supabase.from('forum_posts').insert({
      user_id: user.id,
      author_name: user.fullName,
      title: newTitle,
      body: newBody,
    });
    setNewTitle('');
    setNewBody('');
    setShowCreate(false);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-electric" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div className="glass-card-gold p-4 flex-1 mr-4">
          <h2 className="font-serif text-xl font-bold">Community Forum</h2>
          <p className="text-sm text-muted-foreground">Discuss legal topics with peers.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gradient-electric glow-electric"><Plus className="w-4 h-4 mr-1" />New Post</Button>
      </div>

      {showCreate && (
        <div className="glass-card p-5 space-y-3 border-gold/20">
          <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Post title..." className="bg-secondary/50 border-border/50" />
          <Textarea value={newBody} onChange={e => setNewBody(e.target.value)} placeholder="Write your post..." className="bg-secondary/50 border-border/50" />
          <div className="flex gap-2">
            <Button onClick={handleCreate} className="gradient-electric" disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post'}
            </Button>
            <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {posts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No posts yet. Start the conversation!</p>
          </div>
        )}
        {posts.map(post => (
          <div key={post.id} className="glass-card p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-serif font-semibold text-foreground">{post.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{post.body}</p>
                <p className="text-xs text-muted-foreground/60 mt-2">
                  by {post.author_name} • {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => handleUpvote(post.id)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-gold transition-colors ml-4">
                <ThumbsUp className="w-4 h-4" />{post.upvotes}
              </button>
            </div>
            {post.comments.length > 0 && (
              <div className="mt-4 space-y-2 pl-4 border-l-2 border-border">
                {post.comments.map(c => (
                  <div key={c.id}>
                    <p className="text-sm text-muted-foreground">{c.content}</p>
                    <p className="text-[10px] text-muted-foreground/50">{c.author_name} • {new Date(c.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 mt-3">
              <Input
                value={commentInputs[post.id] || ''}
                onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                placeholder="Add comment..."
                className="bg-secondary/50 border-border/50 text-sm h-8"
                onKeyDown={e => e.key === 'Enter' && handleComment(post.id)}
              />
              <Button size="sm" variant="ghost" onClick={() => handleComment(post.id)}><MessageCircle className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
