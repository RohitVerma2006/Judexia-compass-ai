import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, MessageCircle, Plus } from 'lucide-react';

interface Post { id: number; title: string; body: string; author: string; upvotes: number; comments: string[]; }

const INITIAL_POSTS: Post[] = [
  { id: 1, title: 'Is Article 21 the most powerful fundamental right?', body: 'The Supreme Court has continuously expanded the scope of Article 21. Can it override other rights?', author: 'Priya S.', upvotes: 24, comments: ['Great question! The Maneka Gandhi case really expanded it.', 'I think Article 32 is equally powerful as a remedy.'] },
  { id: 2, title: 'Best resources for CLAT preparation?', body: 'Looking for book recommendations and practice resources for CLAT 2027.', author: 'Rahul V.', upvotes: 18, comments: ['Legal Aptitude by A.P. Bhardwaj is excellent.'] },
  { id: 3, title: 'Understanding the difference between Cognizable and Non-Cognizable offences', body: 'Can someone explain with examples?', author: 'Ananya D.', upvotes: 12, comments: [] },
];

export default function Forum() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});

  const handleUpvote = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
  };

  const handleComment = (id: number) => {
    const text = commentInputs[id];
    if (!text?.trim()) return;
    setPosts(prev => prev.map(p => p.id === id ? { ...p, comments: [...p.comments, text] } : p));
    setCommentInputs(prev => ({ ...prev, [id]: '' }));
  };

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    setPosts(prev => [{ id: Date.now(), title: newTitle, body: newBody, author: 'You', upvotes: 0, comments: [] }, ...prev]);
    setNewTitle(''); setNewBody(''); setShowCreate(false);
  };

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
            <Button onClick={handleCreate} className="gradient-electric">Post</Button>
            <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="glass-card p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-serif font-semibold text-foreground">{post.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{post.body}</p>
                <p className="text-xs text-muted-foreground/60 mt-2">by {post.author}</p>
              </div>
              <button onClick={() => handleUpvote(post.id)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-gold transition-colors ml-4">
                <ThumbsUp className="w-4 h-4" />{post.upvotes}
              </button>
            </div>
            {post.comments.length > 0 && (
              <div className="mt-4 space-y-2 pl-4 border-l-2 border-border">
                {post.comments.map((c, i) => (
                  <p key={i} className="text-sm text-muted-foreground">{c}</p>
                ))}
              </div>
            )}
            <div className="flex gap-2 mt-3">
              <Input value={commentInputs[post.id] || ''} onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))} placeholder="Add comment..." className="bg-secondary/50 border-border/50 text-sm h-8" onKeyDown={e => e.key === 'Enter' && handleComment(post.id)} />
              <Button size="sm" variant="ghost" onClick={() => handleComment(post.id)}><MessageCircle className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
