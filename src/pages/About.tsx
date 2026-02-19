import { Link } from 'react-router-dom';
import { Scale, Brain, MessageSquare, FileText, Smartphone, Zap, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import judexiaLogo from '@/assets/judexia-logo.jpg';

export default function About() {
  const { t, lang, setLang } = useLanguage();

  const features = [
    { icon: Brain, key: 'feature1', descKey: 'feature1Desc' },
    { icon: MessageSquare, key: 'feature2', descKey: 'feature2Desc' },
    { icon: FileText, key: 'feature3', descKey: 'feature3Desc' },
    { icon: Smartphone, key: 'feature4', descKey: 'feature4Desc' },
    { icon: Zap, key: 'feature5', descKey: 'feature5Desc' },
  ] as const;

  return (
    <div className="min-h-screen gradient-bg">
      {/* Top Nav */}
      <nav className="border-b border-border/40 backdrop-blur-md bg-card/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={judexiaLogo} alt="Judexia" className="w-9 h-9 rounded-lg object-cover" />
            <span className="font-serif text-lg font-bold text-foreground">Judexia</span>
          </Link>
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex items-center gap-1 bg-secondary/40 rounded-lg p-1">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${lang === 'en' ? 'bg-electric/20 text-electric' : 'text-muted-foreground hover:text-foreground'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${lang === 'hi' ? 'bg-electric/20 text-electric' : 'text-muted-foreground hover:text-foreground'}`}
              >
                हिं
              </button>
            </div>
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t('signIn')}
            </Link>
            <Link
              to="/signup"
              className="text-sm px-4 py-2 rounded-lg gradient-electric text-white font-medium hover:opacity-90 transition-opacity"
            >
              {t('signUp')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-28 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-electric/5 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs font-medium mb-6 tracking-wider uppercase">
            <Scale className="w-3.5 h-3.5" />
            {t('legalTechPlatform')}
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t('aboutJudexia')}
          </h1>
          <p className="text-muted-foreground text-xl leading-relaxed">
            {t('aboutSubtitle')}
          </p>
        </div>
      </section>

      {/* Section 1 – Who We Are */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-2">{t('whoWeAre')}</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-electric to-gold mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-8 hover:border-electric/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-electric/10 border border-electric/20 flex items-center justify-center mb-5 group-hover:bg-electric/20 transition-colors">
                <Scale className="w-6 h-6 text-electric" />
              </div>
              <p className="text-foreground/90 leading-relaxed text-lg">{t('whoWeAreText1')}</p>
            </div>
            <div className="glass-card p-8 hover:border-gold/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                <Brain className="w-6 h-6 text-gold" />
              </div>
              <p className="text-foreground/90 leading-relaxed text-lg">{t('whoWeAreText2')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 – Our Vision */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <Scale className="w-[400px] h-[400px] text-electric/3" strokeWidth={0.5} />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="glass-card-gold p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-8 animate-glow-pulse">
              <Scale className="w-8 h-8 text-gold" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-gold mb-6">{t('ourVision')}</h2>
            <p className="text-foreground/80 text-lg leading-relaxed max-w-2xl mx-auto">
              {t('visionText')}
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 – What Makes Us Different */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-2">{t('whatMakesDifferent')}</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-electric to-gold mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, key, descKey }, i) => (
              <div
                key={key}
                className="glass-card p-6 hover:border-electric/30 hover:glow-electric transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-electric/10 border border-electric/20 flex items-center justify-center shrink-0 group-hover:bg-electric/20 transition-colors">
                    <Icon className="w-5 h-5 text-electric" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-foreground mb-2">{t(key)}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{t(descKey)}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* CTA card */}
            <div className="glass-card-gold p-6 flex flex-col justify-between group hover:border-gold/50 transition-all duration-300">
              <div>
                <h3 className="font-serif text-base font-semibold text-gold mb-2">{t('readyToStart')}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t('readyToStartDesc')}
                </p>
              </div>
              <Link
                to="/signup"
                className="mt-6 flex items-center gap-2 text-sm font-medium text-electric hover:gap-3 transition-all"
              >
                {t('getStarted')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 text-center px-6">
        <p className="text-xs text-muted-foreground/50 max-w-2xl mx-auto">
          {t('disclaimer')}
        </p>
        <p className="text-xs text-muted-foreground/30 mt-3">{t('copyright')}</p>
      </footer>
    </div>
  );
}
