import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Brain, User, Loader2 } from 'lucide-react';

interface Message { role: 'user' | 'assistant'; content: string }

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-mentor`;

const TOPICS = ['Fundamental Rights', 'Self-Defense', 'Murder vs Culpable Homicide', 'Article 21', 'Article 14', 'FIR Process', 'Bail Provisions'];

export default function CaseStudio() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [awaitingAnalysis, setAwaitingAnalysis] = useState(false);
  const { addXP } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: msg };
    
    let allMessages: Message[];
    if (awaitingAnalysis) {
      // User is submitting analysis - add instruction for AI to evaluate
      const evalMsg: Message = { 
        role: 'user', 
        content: `The student has submitted the following legal analysis of the case above. Please evaluate it thoroughly:\n\n${msg}\n\nProvide: what they got right, missing arguments, suggested improvements, precedent references they should cite, and a score out of 10.` 
      };
      allMessages = [...messages, evalMsg];
      setMessages(prev => [...prev, userMsg]);
      setAwaitingAnalysis(false);
    } else {
      const casePrompt: Message = { 
        role: 'user', 
        content: `Generate a detailed legal case study on this topic: "${msg}". Include Case Title, Background Facts, Evidence, Legal Issues, Arguments from both sides, Court Reasoning, Final Judgment, Relevant Articles/Sections, and Landmark Precedents.`
      };
      allMessages = [...messages, casePrompt];
      setMessages(prev => [...prev, userMsg]);
    }

    setInput('');
    setIsLoading(true);

    let assistantSoFar = '';
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages, mode: 'case-studio' }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: 'Failed to connect' }));
        upsertAssistant(err.error || 'An error occurred. Please try again.');
        setIsLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsertAssistant(content);
          } catch { textBuffer = line + '\n' + textBuffer; break; }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw || !raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsertAssistant(content);
          } catch {}
        }
      }

      // After case generation, prompt for analysis
      if (!awaitingAnalysis) {
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: '🎯 **Your Turn:** Now analyze this case — which laws are applicable or violated? What arguments would you make? Type your reasoning below for AI evaluation.' 
          }]);
          setAwaitingAnalysis(true);
        }, 500);
        addXP(15);
      } else {
        addXP(25);
      }
    } catch (e) {
      console.error(e);
      upsertAssistant('Connection error. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col animate-fade-in">
      <div className="glass-card-gold p-4 mb-4">
        <h2 className="font-serif text-xl font-bold">AI Case Studio</h2>
        <p className="text-sm text-muted-foreground">Analyze legal cases with AI-powered reasoning. Get detailed case studies and intelligent evaluation.</p>
      </div>

      <ScrollArea className="flex-1 glass-card p-4 mb-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Start by asking about a legal topic...</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {TOPICS.map(t => (
                  <button key={t} onClick={() => handleSend(`Explain ${t} using a real-life case.`)} className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-electric/40 hover:text-electric transition-colors">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && <div className="w-8 h-8 rounded-lg bg-electric/20 flex items-center justify-center shrink-0"><Brain className="w-4 h-4 text-electric" /></div>}
              <div className={`max-w-[80%] rounded-xl p-4 ${msg.role === 'user' ? 'bg-electric/20 text-foreground' : 'glass-card border-gold/20'}`}>
                <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              </div>
              {msg.role === 'user' && <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center shrink-0"><User className="w-4 h-4 text-gold" /></div>}
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-electric/20 flex items-center justify-center shrink-0"><Loader2 className="w-4 h-4 text-electric animate-spin" /></div>
              <div className="glass-card border-gold/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" /> Analyzing...
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={awaitingAnalysis ? "Type your legal analysis..." : "Ask about a legal topic..."}
          className="bg-secondary/50 border-border/50 text-foreground"
          disabled={isLoading}
        />
        <Button onClick={() => handleSend()} className="gradient-electric glow-electric shrink-0" disabled={isLoading}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
