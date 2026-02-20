import { useState } from 'react';
import { BookOpen, ChevronDown, Scale, Calendar, Landmark } from 'lucide-react';

const CASES = [
  {
    title: 'Kesavananda Bharati v. State of Kerala (1973)',
    area: 'Constitutional Law',
    summary: 'Established the Basic Structure Doctrine – Parliament cannot amend the basic structure of the Constitution.',
    court: 'Supreme Court of India',
    bench: '13-Judge Bench',
    year: '1973',
    significance: 'This is considered the most important case in Indian constitutional history. The 13-judge bench held that while Parliament has wide powers to amend the Constitution under Article 368, it cannot alter or destroy its "basic structure." This includes federalism, secularism, democracy, separation of powers, and judicial review.',
    keyPrinciples: ['Basic Structure Doctrine', 'Limits on Amending Power', 'Judicial Review preserved'],
  },
  {
    title: 'Maneka Gandhi v. Union of India (1978)',
    area: 'Fundamental Rights',
    summary: 'Expanded Article 21 to include the right to live with dignity.',
    court: 'Supreme Court of India',
    bench: '7-Judge Bench',
    year: '1978',
    significance: 'The Court expanded the scope of Article 21 (Right to Life and Personal Liberty) far beyond mere animal existence. It held that any procedure depriving a person of life or liberty must be "fair, just, and reasonable" — not merely a procedure established by law. This case interconnected Articles 14, 19, and 21.',
    keyPrinciples: ['Due Process of Law', 'Right to Live with Dignity', 'Golden Triangle of Rights (Art. 14, 19, 21)'],
  },
  {
    title: 'Vishaka v. State of Rajasthan (1997)',
    area: "Women's Rights",
    summary: 'Laid down guidelines to prevent sexual harassment at the workplace.',
    court: 'Supreme Court of India',
    bench: 'Justice J.S. Verma (CJI)',
    year: '1997',
    significance: 'In the absence of legislation on workplace sexual harassment, the Supreme Court laid down binding guidelines (Vishaka Guidelines) drawing from CEDAW and constitutional provisions. These remained law until the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 was enacted.',
    keyPrinciples: ['Vishaka Guidelines', 'Right to Safe Workplace', 'Gender Equality under Art. 14 & 15'],
  },
  {
    title: 'K.M. Nanavati v. State of Maharashtra (1962)',
    area: 'Criminal Law',
    summary: 'The last jury trial in India. Examined the distinction between murder and culpable homicide.',
    court: 'Supreme Court of India',
    bench: '3-Judge Bench',
    year: '1962',
    significance: 'Commander Nanavati shot his wife\'s lover and was initially acquitted by a jury. The Bombay High Court overturned the verdict, and the Supreme Court upheld the conviction. This case led to the abolition of the jury system in India and clarified the distinction between "sudden provocation" and premeditated murder under IPC Section 300.',
    keyPrinciples: ['Abolition of Jury System', 'Murder vs Culpable Homicide', 'Grave and Sudden Provocation'],
  },
  {
    title: 'Olga Tellis v. Bombay Municipal Corporation (1985)',
    area: 'Right to Livelihood',
    summary: 'Held that the right to livelihood is an integral facet of the right to life under Article 21.',
    court: 'Supreme Court of India',
    bench: '5-Judge Bench',
    year: '1985',
    significance: 'Pavement dwellers challenged eviction by BMC. The Court held that the right to livelihood is part of the right to life under Article 21. While the eviction was ultimately upheld, the judgment established that no person can be deprived of livelihood without a fair hearing and due process.',
    keyPrinciples: ['Right to Livelihood', 'Natural Justice', 'Pavement Dwellers\' Rights'],
  },
  {
    title: 'S.R. Bommai v. Union of India (1994)',
    area: 'Federal Structure',
    summary: "Defined limits on the use of Article 356 (President's Rule) and strengthened federalism.",
    court: 'Supreme Court of India',
    bench: '9-Judge Bench',
    year: '1994',
    significance: 'This landmark case curtailed the misuse of Article 356 by the Centre. The Court held that the President\'s proclamation under Article 356 is subject to judicial review, and that secularism is a basic feature of the Constitution. The floor test in the Assembly was deemed the proper method to determine a government\'s majority.',
    keyPrinciples: ['Judicial Review of Art. 356', 'Secularism as Basic Structure', 'Floor Test Doctrine'],
  },
  {
    title: 'Puttaswamy v. Union of India (2017)',
    area: 'Right to Privacy',
    summary: 'Declared the right to privacy as a fundamental right under Article 21.',
    court: 'Supreme Court of India',
    bench: '9-Judge Bench',
    year: '2017',
    significance: 'A unanimous 9-judge bench overruled previous decisions and declared the right to privacy as intrinsic to life and liberty under Article 21. The judgment has far-reaching implications for data protection, bodily autonomy, sexual orientation, and the Aadhaar framework.',
    keyPrinciples: ['Right to Privacy as Fundamental Right', 'Informational Privacy', 'Bodily Autonomy'],
  },
  {
    title: 'Indra Sawhney v. Union of India (1992)',
    area: 'Reservations',
    summary: 'Upheld 27% reservation for OBCs and imposed a 50% ceiling on total reservations.',
    court: 'Supreme Court of India',
    bench: '9-Judge Bench',
    year: '1992',
    significance: 'Known as the Mandal Commission case, this judgment upheld 27% reservation for Other Backward Classes (OBCs) while imposing a 50% ceiling on total reservations. It also introduced the "creamy layer" concept to exclude affluent members of backward classes from reservation benefits.',
    keyPrinciples: ['50% Reservation Ceiling', 'Creamy Layer Exclusion', 'OBC Reservation upheld'],
  },
];

export default function CaseLibrary() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="glass-card-gold p-4">
        <h2 className="font-serif text-xl font-bold">Case Library</h2>
        <p className="text-sm text-muted-foreground">Browse landmark Indian legal cases. Click to explore details.</p>
      </div>
      <div className="grid gap-4">
        {CASES.map((c, i) => (
          <div
            key={i}
            className={`glass-card overflow-hidden transition-all duration-300 cursor-pointer ${expanded === i ? 'border-electric/40 shadow-lg shadow-electric/5' : 'hover:border-electric/30'}`}
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif font-semibold text-foreground text-sm">{c.title}</h3>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300 ${expanded === i ? 'rotate-180' : ''}`} />
                  </div>
                  <span className="text-xs text-electric">{c.area}</span>
                  <p className="text-sm text-muted-foreground mt-1">{c.summary}</p>
                </div>
              </div>
            </div>

            {expanded === i && (
              <div className="border-t border-border/50 bg-muted/20 p-5 space-y-4 animate-fade-in">
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Landmark className="w-3.5 h-3.5 text-gold" />
                    <span>{c.court}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Scale className="w-3.5 h-3.5 text-electric" />
                    <span>{c.bench}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 text-gold" />
                    <span>{c.year}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-serif font-semibold text-sm mb-1">Significance</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.significance}</p>
                </div>

                <div>
                  <h4 className="font-serif font-semibold text-sm mb-2">Key Principles</h4>
                  <div className="flex flex-wrap gap-2">
                    {c.keyPrinciples.map((p, j) => (
                      <span key={j} className="text-xs px-2.5 py-1 rounded-full border border-electric/30 bg-electric/5 text-electric">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
