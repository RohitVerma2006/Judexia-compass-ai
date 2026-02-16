import { BookOpen } from 'lucide-react';

const CASES = [
  { title: 'Kesavananda Bharati v. State of Kerala (1973)', area: 'Constitutional Law', summary: 'Established the Basic Structure Doctrine – Parliament cannot amend the basic structure of the Constitution.' },
  { title: 'Maneka Gandhi v. Union of India (1978)', area: 'Fundamental Rights', summary: 'Expanded Article 21 to include the right to live with dignity. Established that procedure must be fair, just, and reasonable.' },
  { title: 'Vishaka v. State of Rajasthan (1997)', area: 'Women\'s Rights', summary: 'Laid down guidelines to prevent sexual harassment at the workplace, later codified into the POSH Act, 2013.' },
  { title: 'K.M. Nanavati v. State of Maharashtra (1962)', area: 'Criminal Law', summary: 'The last jury trial in India. Examined the distinction between murder and culpable homicide not amounting to murder.' },
  { title: 'Olga Tellis v. Bombay Municipal Corporation (1985)', area: 'Right to Livelihood', summary: 'Held that the right to livelihood is an integral facet of the right to life under Article 21.' },
  { title: 'S.R. Bommai v. Union of India (1994)', area: 'Federal Structure', summary: 'Defined limits on the use of Article 356 (President\'s Rule) and strengthened federalism.' },
  { title: 'Puttaswamy v. Union of India (2017)', area: 'Right to Privacy', summary: 'Declared the right to privacy as a fundamental right under Article 21 of the Constitution.' },
  { title: 'Indra Sawhney v. Union of India (1992)', area: 'Reservations', summary: 'Upheld 27% reservation for OBCs and imposed a 50% ceiling on total reservations.' },
];

export default function CaseLibrary() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="glass-card-gold p-4">
        <h2 className="font-serif text-xl font-bold">Case Library</h2>
        <p className="text-sm text-muted-foreground">Browse landmark Indian legal cases.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {CASES.map((c, i) => (
          <div key={i} className="glass-card p-5 hover:border-electric/30 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-foreground text-sm">{c.title}</h3>
                <span className="text-xs text-electric">{c.area}</span>
                <p className="text-sm text-muted-foreground mt-2">{c.summary}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
