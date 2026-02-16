import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Brain, User } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  content: string;
  structured?: {
    title?: string;
    scenario?: string;
    evidence?: string;
    legalBackground?: string;
    articles?: string[];
    landmarks?: string[];
    evaluation?: string;
    improvements?: string;
  };
}

const CASE_RESPONSES: Record<string, Message['structured']> = {
  'fundamental rights': {
    title: 'Maneka Gandhi v. Union of India (1978)',
    scenario: 'Maneka Gandhi\'s passport was impounded by the government without giving her a hearing. She challenged this under Article 21.',
    evidence: 'Passport impounded under Passports Act, 1967 without prior notice or hearing.',
    legalBackground: 'The case expanded the interpretation of Article 21 (Right to Life and Personal Liberty) to include the right to live with dignity.',
    articles: ['Article 14 – Right to Equality', 'Article 19 – Freedom of Speech and Expression', 'Article 21 – Right to Life and Personal Liberty'],
    landmarks: ['Maneka Gandhi v. Union of India (1978)', 'Kesavananda Bharati v. State of Kerala (1973)', 'A.K. Gopalan v. State of Madras (1950)'],
  },
  'self-defense': {
    title: 'Right to Private Defence – IPC Sections 96-106',
    scenario: 'A homeowner finds an armed intruder at night. In the struggle, the intruder is fatally injured. The homeowner claims self-defense.',
    evidence: 'Testimony of homeowner, signs of forced entry, weapon found on intruder.',
    legalBackground: 'IPC Section 96 provides the right of private defence of body and property. Section 100 extends this right to causing death in certain situations.',
    articles: ['IPC Section 96 – Right of Private Defence', 'IPC Section 97 – Right of Private Defence of Body and Property', 'IPC Section 100 – When the Right Extends to Causing Death'],
    landmarks: ['Darshan Singh v. State of Punjab (2010)', 'Vidhya Singh v. State of MP (1971)'],
  },
  'murder': {
    title: 'Murder vs Culpable Homicide – IPC Section 300 & 299',
    scenario: 'A heated argument between neighbors escalates. One strikes the other with a heavy object, causing death. Was it murder or culpable homicide?',
    evidence: 'Witness statements, post-mortem report showing blunt force trauma, history of disputes.',
    legalBackground: 'Section 299 defines culpable homicide, while Section 300 elevates it to murder based on intention and knowledge.',
    articles: ['IPC Section 299 – Culpable Homicide', 'IPC Section 300 – Murder', 'IPC Section 304 – Punishment for Culpable Homicide Not Amounting to Murder'],
    landmarks: ['Reg v. Govinda (1876)', 'K.M. Nanavati v. State of Maharashtra (1962)', 'Virsa Singh v. State of Punjab (1958)'],
  },
  'article 21': {
    title: 'Right to Life – Article 21 Deep Dive',
    scenario: 'A group of slum dwellers face forced eviction without rehabilitation. They challenge the eviction under Article 21.',
    evidence: 'Government eviction orders, lack of rehabilitation plan, impact on livelihood.',
    legalBackground: 'Article 21 has been interpreted broadly to include right to livelihood, shelter, health, education, and clean environment.',
    articles: ['Article 21 – Right to Life and Personal Liberty', 'Article 19(1)(e) – Right to Reside', 'Article 39(a) – Right to Adequate Means of Livelihood'],
    landmarks: ['Olga Tellis v. Bombay Municipal Corporation (1985)', 'Francis Coralie Mullin v. Administrator, UT of Delhi (1981)'],
  },
  'article 14': {
    title: 'Right to Equality – Article 14 Analysis',
    scenario: 'A government job notification excludes candidates above 30 years. A 32-year-old candidate challenges this as arbitrary discrimination.',
    evidence: 'Job notification, applicant credentials, comparable positions without age limits.',
    legalBackground: 'Article 14 ensures equality before law and equal protection of laws. The doctrine of reasonable classification allows differentiation with a rational nexus.',
    articles: ['Article 14 – Right to Equality', 'Article 15 – Prohibition of Discrimination', 'Article 16 – Equality of Opportunity in Public Employment'],
    landmarks: ['E.P. Royappa v. State of Tamil Nadu (1974)', 'Budhan Choudhry v. State of Bihar (1955)'],
  },
};

function findCaseResponse(input: string): Message['structured'] | null {
  const lower = input.toLowerCase();
  for (const [keyword, response] of Object.entries(CASE_RESPONSES)) {
    if (lower.includes(keyword)) return response;
  }
  return null;
}

export default function CaseStudio() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [awaitingAnalysis, setAwaitingAnalysis] = useState(false);
  const { addXP } = useAuth();

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);

    if (awaitingAnalysis) {
      const lower = input.toLowerCase();
      const mentionsArticle = /article\s*\d+|section\s*\d+|ipc|right/i.test(lower);
      const aiResponse: Message = {
        role: 'ai',
        content: '',
        structured: {
          evaluation: mentionsArticle
            ? '✅ Excellent analysis! You correctly identified the relevant legal provisions.'
            : '⚠️ Good attempt! Consider identifying specific articles and sections that apply.',
          improvements: mentionsArticle
            ? 'To strengthen your analysis further, consider discussing the exceptions and landmark precedents that shaped this area of law.'
            : 'Try referencing specific constitutional articles (e.g., Article 14, 21) or IPC sections that are relevant to this case.',
        },
      };
      setMessages(prev => [...prev, aiResponse]);
      addXP(mentionsArticle ? 30 : 10);
      setAwaitingAnalysis(false);
    } else {
      const caseData = findCaseResponse(input);
      if (caseData) {
        const aiMsg: Message = { role: 'ai', content: '', structured: caseData };
        const followUp: Message = { role: 'ai', content: '🎯 Now analyze this case: Which laws are applicable or violated? Type your reasoning below.' };
        setMessages(prev => [...prev, aiMsg, followUp]);
        setAwaitingAnalysis(true);
        addXP(15);
      } else {
        const fallback: Message = {
          role: 'ai',
          content: 'I can help you analyze cases related to Fundamental Rights, Self-Defense, Murder vs Culpable Homicide, Article 14, and Article 21. Try asking about one of these topics!',
        };
        setMessages(prev => [...prev, fallback]);
      }
    }
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col animate-fade-in">
      <div className="glass-card-gold p-4 mb-4">
        <h2 className="font-serif text-xl font-bold text-foreground">AI Case Studio</h2>
        <p className="text-sm text-muted-foreground">Analyze legal cases with AI-powered reasoning. Try: "Explain Fundamental Rights using a real-life case."</p>
      </div>

      <ScrollArea className="flex-1 glass-card p-4 mb-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Start by asking about a legal topic...</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {['Fundamental Rights', 'Self-Defense', 'Murder vs Culpable Homicide', 'Article 21', 'Article 14'].map(t => (
                  <button key={t} onClick={() => { setInput(`Explain ${t} using a real-life case.`); }} className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-electric/40 hover:text-electric transition-colors">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && <div className="w-8 h-8 rounded-lg bg-electric/20 flex items-center justify-center shrink-0"><Brain className="w-4 h-4 text-electric" /></div>}
              <div className={`max-w-[80%] rounded-xl p-4 ${msg.role === 'user' ? 'bg-electric/20 text-foreground' : 'glass-card border-gold/20'}`}>
                {msg.content && <p className="text-sm">{msg.content}</p>}
                {msg.structured && (
                  <div className="space-y-3 text-sm">
                    {msg.structured.title && <h3 className="font-serif font-bold text-gold text-base">{msg.structured.title}</h3>}
                    {msg.structured.scenario && <div><span className="text-electric font-semibold">📋 Scenario:</span><p className="text-muted-foreground mt-1">{msg.structured.scenario}</p></div>}
                    {msg.structured.evidence && <div><span className="text-electric font-semibold">🔍 Evidence:</span><p className="text-muted-foreground mt-1">{msg.structured.evidence}</p></div>}
                    {msg.structured.legalBackground && <div><span className="text-electric font-semibold">⚖️ Legal Background:</span><p className="text-muted-foreground mt-1">{msg.structured.legalBackground}</p></div>}
                    {msg.structured.articles && <div><span className="text-electric font-semibold">📜 Relevant Articles:</span><ul className="list-disc list-inside text-muted-foreground mt-1">{msg.structured.articles.map((a, j) => <li key={j}>{a}</li>)}</ul></div>}
                    {msg.structured.landmarks && <div><span className="text-electric font-semibold">🏛️ Landmark Cases:</span><ul className="list-disc list-inside text-muted-foreground mt-1">{msg.structured.landmarks.map((l, j) => <li key={j}>{l}</li>)}</ul></div>}
                    {msg.structured.evaluation && <div className="p-3 rounded-lg bg-secondary/50"><p className="font-semibold">{msg.structured.evaluation}</p></div>}
                    {msg.structured.improvements && <p className="text-muted-foreground italic">{msg.structured.improvements}</p>}
                  </div>
                )}
              </div>
              {msg.role === 'user' && <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center shrink-0"><User className="w-4 h-4 text-gold" /></div>}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={awaitingAnalysis ? "Type your legal analysis..." : "Ask about a legal topic..."}
          className="bg-secondary/50 border-border/50 text-foreground"
        />
        <Button onClick={handleSend} className="gradient-electric glow-electric shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
