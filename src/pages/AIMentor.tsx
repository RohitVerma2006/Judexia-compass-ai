import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageSquare, User } from 'lucide-react';

interface Msg { role: 'user' | 'ai'; content: string; structured?: { definition?: string; explanation?: string; example?: string; caseRef?: string; recap?: string } }

const MENTOR_DB: Record<string, Msg['structured']> = {
  'article 21': {
    definition: 'Article 21 of the Indian Constitution states: "No person shall be deprived of his life or personal liberty except according to the procedure established by law."',
    explanation: 'Originally interpreted narrowly, the Supreme Court expanded Article 21 to encompass the right to live with dignity, including rights to livelihood, shelter, health, education, privacy, and a clean environment.',
    example: 'In Olga Tellis v. Bombay Municipal Corporation (1985), pavement dwellers challenged eviction. The Court held that the right to livelihood is part of the right to life under Article 21.',
    caseRef: 'Maneka Gandhi v. Union of India (1978) – Expanded Article 21 to require fair, just, and reasonable procedure.',
    recap: 'Article 21 is the most dynamically interpreted fundamental right, serving as the bedrock of human dignity in Indian constitutional law.',
  },
  'private defence': {
    definition: 'The Right of Private Defence (IPC Sections 96-106) allows a person to use reasonable force to protect themselves or their property from an imminent threat.',
    explanation: 'This right is not about retribution but prevention. The force used must be proportionate to the threat. Section 100 allows causing death in extreme cases like attempted murder, robbery, or kidnapping.',
    example: 'A shopkeeper confronted by armed robbers can use lethal force if no reasonable alternative exists and there is imminent danger to life.',
    caseRef: 'Darshan Singh v. State of Punjab (2010) – The Supreme Court laid down key principles for invoking the right to private defence.',
    recap: 'Private defence is a fundamental right of self-preservation. It requires an imminent threat, proportionate response, and absence of time to seek state protection.',
  },
  'murder': {
    definition: 'Murder (IPC Section 300) is culpable homicide committed with the intention of causing death, or with the intention of causing bodily injury known to be likely to cause death.',
    explanation: 'Not all killings are murder. The key difference lies in intention and knowledge. Section 299 covers culpable homicide (broader), while Section 300 narrows it to murder based on specific intentions.',
    example: 'In K.M. Nanavati v. State of Maharashtra (1962), a naval officer killed his wife\'s lover. The case examined whether it was murder or culpable homicide not amounting to murder.',
    caseRef: 'Virsa Singh v. State of Punjab (1958) – The Court established the test for intention under Section 300.',
    recap: 'Murder = culpable homicide + specific intention/knowledge. The exceptions in Section 300 can reduce murder to culpable homicide not amounting to murder.',
  },
  'section 300': {
    definition: 'IPC Section 300 defines murder as culpable homicide that meets specific conditions regarding intention, knowledge, and the nature of bodily injury inflicted.',
    explanation: 'Section 300 has 4 clauses and 5 exceptions. The four clauses cover: (1) intention to cause death, (2) intention to cause injury known to cause death, (3) intention to cause injury sufficient in ordinary course to cause death, (4) knowledge that the act is dangerous enough to cause death.',
    example: 'A person stabs another in the chest knowing it will likely cause death. This falls under Clause 3 of Section 300.',
    caseRef: 'Reg v. Govinda (1876) – One of the earliest cases distinguishing Section 299 and 300.',
    recap: 'Section 300 = specific conditions that elevate culpable homicide to murder. Five exceptions can reduce it back to culpable homicide.',
  },
};

function findMentorResponse(input: string): Msg['structured'] | null {
  const lower = input.toLowerCase();
  for (const [kw, resp] of Object.entries(MENTOR_DB)) {
    if (lower.includes(kw)) return resp;
  }
  return null;
}

export default function AIMentor() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const { addXP } = useAuth();

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    const resp = findMentorResponse(input);
    if (resp) {
      setMessages(prev => [...prev, { role: 'ai', content: '', structured: resp }]);
      addXP(10);
    } else {
      setMessages(prev => [...prev, { role: 'ai', content: 'I can help with Article 21, Right to Private Defence, Murder vs Culpable Homicide, and IPC Section 300. Ask me about these!' }]);
    }
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col animate-fade-in">
      <div className="glass-card-gold p-4 mb-4">
        <h2 className="font-serif text-xl font-bold">AI Legal Mentor</h2>
        <p className="text-sm text-muted-foreground">Ask legal questions and get structured mentorship.</p>
      </div>

      <ScrollArea className="flex-1 glass-card p-4 mb-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Ask me any legal question...</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {['What is Article 21?', 'Explain Private Defence', 'Difference between murder and culpable homicide?', 'Explain IPC Section 300'].map(t => (
                  <button key={t} onClick={() => setInput(t)} className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-electric/40 hover:text-electric transition-colors">{t}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && <div className="w-8 h-8 rounded-lg bg-electric/20 flex items-center justify-center shrink-0"><MessageSquare className="w-4 h-4 text-electric" /></div>}
              <div className={`max-w-[80%] rounded-xl p-4 ${msg.role === 'user' ? 'bg-electric/20' : 'glass-card border-gold/20'}`}>
                {msg.content && <p className="text-sm">{msg.content}</p>}
                {msg.structured && (
                  <div className="space-y-3 text-sm">
                    {msg.structured.definition && <div><span className="text-electric font-semibold">📖 Definition:</span><p className="text-muted-foreground mt-1">{msg.structured.definition}</p></div>}
                    {msg.structured.explanation && <div><span className="text-electric font-semibold">💡 Explanation:</span><p className="text-muted-foreground mt-1">{msg.structured.explanation}</p></div>}
                    {msg.structured.example && <div><span className="text-electric font-semibold">📋 Example:</span><p className="text-muted-foreground mt-1">{msg.structured.example}</p></div>}
                    {msg.structured.caseRef && <div><span className="text-electric font-semibold">🏛️ Case Reference:</span><p className="text-muted-foreground mt-1">{msg.structured.caseRef}</p></div>}
                    {msg.structured.recap && <div className="p-3 rounded-lg bg-secondary/50"><span className="text-gold font-semibold">📝 Quick Recap:</span><p className="text-muted-foreground mt-1">{msg.structured.recap}</p></div>}
                  </div>
                )}
              </div>
              {msg.role === 'user' && <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center shrink-0"><User className="w-4 h-4 text-gold" /></div>}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask a legal question..." className="bg-secondary/50 border-border/50" />
        <Button onClick={handleSend} className="gradient-electric glow-electric shrink-0"><Send className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}
