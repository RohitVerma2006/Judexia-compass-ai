import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, CheckCircle, XCircle } from 'lucide-react';

const QUESTIONS = [
  { q: 'Which Article of the Indian Constitution guarantees the Right to Life and Personal Liberty?', options: ['Article 14', 'Article 19', 'Article 21', 'Article 32'], correct: 2 },
  { q: 'IPC Section 300 deals with which offence?', options: ['Theft', 'Murder', 'Cheating', 'Kidnapping'], correct: 1 },
  { q: 'The Kesavananda Bharati case established which doctrine?', options: ['Due Process', 'Basic Structure', 'Separation of Powers', 'Judicial Review'], correct: 1 },
  { q: 'Right to Private Defence is covered under which IPC sections?', options: ['Sections 76-95', 'Sections 96-106', 'Sections 107-120', 'Sections 121-130'], correct: 1 },
  { q: 'Which landmark case expanded the scope of Article 21?', options: ['Golaknath v. State of Punjab', 'Maneka Gandhi v. Union of India', 'Minerva Mills v. Union of India', 'S.R. Bommai v. Union of India'], correct: 1 },
];

const LEADERBOARD = [
  { name: 'Priya Sharma', score: 5, xp: 1200 },
  { name: 'Rahul Verma', score: 4, xp: 980 },
  { name: 'Ananya Das', score: 4, xp: 870 },
  { name: 'Vikram Singh', score: 3, xp: 650 },
];

export default function QuizMode() {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(5).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const { addXP, user } = useAuth();

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    const score = answers.reduce((s, a, i) => (a === QUESTIONS[i].correct ? s + 1 : s), 0) as number;
    addXP(score * 20);
  }, [answers, addXP]);

  useEffect(() => {
    if (!started || submitted) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [started, submitted, timeLeft, handleSubmit]);

  const score = answers.reduce((s, a, i) => (a === QUESTIONS[i].correct ? s + 1 : s), 0) as number;

  if (!started) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20">
        <div className="glass-card-gold p-8 text-center max-w-md">
          <Trophy className="w-16 h-16 text-gold mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold mb-2">Quiz Mode</h2>
          <p className="text-muted-foreground mb-6">5 questions • 60 seconds • Earn XP</p>
          <Button onClick={() => setStarted(true)} className="gradient-electric glow-electric">Start Quiz</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {!submitted && (
        <div className="flex items-center justify-between glass-card p-4">
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-electric" /><span className="text-sm font-mono font-bold text-foreground">{timeLeft}s</span></div>
          <Progress value={(timeLeft / 60) * 100} className="w-40 h-2 bg-muted [&>div]:bg-electric" />
          <Badge variant="outline" className="border-gold/40 text-gold">{answers.filter(a => a !== null).length}/5 answered</Badge>
        </div>
      )}

      {submitted ? (
        <div className="space-y-6">
          <div className="glass-card-gold p-6 text-center">
            <Trophy className="w-12 h-12 text-gold mx-auto mb-2" />
            <h2 className="font-serif text-2xl font-bold">{score}/5 Correct</h2>
            <p className="text-muted-foreground">+{score * 20} XP earned!</p>
          </div>
          <div className="space-y-3">
            {QUESTIONS.map((q, i) => (
              <div key={i} className={`glass-card p-4 border ${answers[i] === q.correct ? 'border-green-500/30' : 'border-destructive/30'}`}>
                <div className="flex items-start gap-2">
                  {answers[i] === q.correct ? <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />}
                  <div>
                    <p className="text-sm font-medium">{q.q}</p>
                    <p className="text-xs text-muted-foreground mt-1">Correct: {q.options[q.correct]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Leaderboard */}
          <div className="glass-card p-6">
            <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-gold" /> Leaderboard</h3>
            <div className="space-y-2">
              {[...LEADERBOARD, { name: user?.fullName || 'You', score, xp: score * 20 }].sort((a, b) => b.score - a.score).map((entry, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${entry.name === user?.fullName ? 'bg-electric/10 border border-electric/20' : 'bg-secondary/30'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-gold font-bold w-6">#{i + 1}</span>
                    <span className="text-sm font-medium">{entry.name}</span>
                  </div>
                  <span className="text-sm text-gold">{entry.score}/5</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {QUESTIONS.map((q, i) => (
            <div key={i} className="glass-card p-5">
              <p className="text-sm font-medium mb-3">{i + 1}. {q.q}</p>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, j) => (
                  <button key={j} onClick={() => setAnswers(prev => { const n = [...prev]; n[i] = j; return n; })}
                    className={`text-left text-sm p-3 rounded-lg border transition-all ${answers[i] === j ? 'border-electric bg-electric/10 text-electric' : 'border-border hover:border-electric/30'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <Button onClick={handleSubmit} className="w-full gradient-electric glow-electric">Submit Quiz</Button>
        </div>
      )}
    </div>
  );
}
