import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Map, CheckCircle } from 'lucide-react';

const GOALS = [
  { id: 'clat', label: 'CLAT Aspirant', desc: 'Prepare for Common Law Admission Test' },
  { id: 'judiciary', label: 'Judiciary Aspirant', desc: 'Prepare for judicial services examination' },
  { id: 'student', label: 'Law Student', desc: 'Strengthen academic legal knowledge' },
  { id: 'citizen', label: 'Citizen Awareness', desc: 'Understand your legal rights' },
];

const ROADMAPS: Record<string, { week: string; topic: string; task: string }[]> = {
  clat: [
    { week: 'Week 1-2', topic: 'Legal Reasoning Basics', task: 'Practice 50 legal reasoning questions daily' },
    { week: 'Week 3-4', topic: 'Indian Constitution – Part III', task: 'Study Articles 12-35, solve case-based questions' },
    { week: 'Week 5-6', topic: 'Contract Law & Torts', task: 'Read key cases: Carlill v Carbolic, Donoghue v Stevenson' },
    { week: 'Week 7-8', topic: 'Criminal Law Basics', task: 'Study IPC Sections 299-304, practice MCQs' },
  ],
  judiciary: [
    { week: 'Week 1-2', topic: 'Constitutional Law – Advanced', task: 'Study Basic Structure Doctrine, Fundamental Rights deeply' },
    { week: 'Week 3-4', topic: 'CrPC & Evidence Act', task: 'Focus on procedure, bail provisions, evidence admissibility' },
    { week: 'Week 5-6', topic: 'Civil Procedure Code', task: 'Study Orders I-XXI, practice moot problems' },
    { week: 'Week 7-8', topic: 'Mock Tests & Answer Writing', task: 'Write 3 full-length mock tests, review model answers' },
  ],
  student: [
    { week: 'Week 1-2', topic: 'Jurisprudence Fundamentals', task: 'Study schools of law: Natural, Positivist, Realist' },
    { week: 'Week 3-4', topic: 'Contract Law', task: 'Indian Contract Act 1872 – Offer, Acceptance, Consideration' },
    { week: 'Week 5-6', topic: 'Constitutional Law', task: 'Fundamental Rights and Directive Principles' },
    { week: 'Week 7-8', topic: 'Moot Court Preparation', task: 'Draft memorials, practice oral arguments' },
  ],
  citizen: [
    { week: 'Week 1-2', topic: 'Know Your Rights', task: 'Study fundamental rights under Part III of Constitution' },
    { week: 'Week 3-4', topic: 'Consumer Protection', task: 'Understand Consumer Protection Act 2019, filing complaints' },
    { week: 'Week 5-6', topic: 'Property & Rental Laws', task: 'Learn about Rent Control Act, Transfer of Property Act' },
    { week: 'Week 7-8', topic: 'Cyber Law Basics', task: 'Study IT Act 2000, online fraud prevention' },
  ],
};

export default function Roadmap() {
  const [goal, setGoal] = useState('');
  const [generated, setGenerated] = useState(false);
  const { addXP } = useAuth();

  const handleGenerate = () => {
    if (goal) { setGenerated(true); addXP(15); }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="glass-card-gold p-4">
        <h2 className="font-serif text-xl font-bold">Personalized Legal Roadmap</h2>
        <p className="text-sm text-muted-foreground">Select your goal and get an AI-generated study plan.</p>
      </div>

      {!generated ? (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {GOALS.map(g => (
              <button key={g.id} onClick={() => setGoal(g.id)} className={`glass-card p-5 text-left transition-all ${goal === g.id ? 'border-electric glow-electric' : 'hover:border-electric/30'}`}>
                <h3 className="font-serif font-semibold">{g.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{g.desc}</p>
              </button>
            ))}
          </div>
          <Button onClick={handleGenerate} disabled={!goal} className="w-full gradient-electric glow-electric">Generate Roadmap</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Badge variant="outline" className="border-gold/40 text-gold">AI Generated Plan – Demo Preview</Badge>
          <div className="space-y-3">
            {ROADMAPS[goal]?.map((item, i) => (
              <div key={i} className="glass-card p-5 flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-electric/10 flex items-center justify-center shrink-0">
                  <Map className="w-5 h-5 text-electric" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-gold font-semibold text-sm">{item.week}</span>
                    <span className="text-foreground font-medium text-sm">– {item.topic}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 flex items-start gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />{item.task}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" onClick={() => { setGenerated(false); setGoal(''); }}>← Choose Another Goal</Button>
        </div>
      )}
    </div>
  );
}
