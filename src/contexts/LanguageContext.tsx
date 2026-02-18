import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

export const translations = {
  en: {
    // Auth
    welcomeBack: 'Welcome Back',
    signInContinue: 'Sign in to continue learning',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    signInGoogle: 'Sign in with Google',
    noAccount: "Don't have an account?",
    signUp: 'Sign up',
    createAccount: 'Create Account',
    startTraining: 'Start training your legal mind',
    fullName: 'Full Name',
    confirmPassword: 'Confirm Password',
    alreadyAccount: 'Already have an account?',
    signInLink: 'Sign in',
    orContinueWith: 'or continue with',
    signUpGoogle: 'Sign up with Google',
    passwordMismatch: 'Passwords do not match',
    trainLegalMind: 'Train Your Legal Mind',
    aiPowered: 'with Intelligent Systems powered by AI.',
    beginJourney: 'Begin Your Legal Journey',
    joinThousands: 'Join thousands of aspiring legal professionals.',
    // Dashboard
    welcomeBack2: 'Welcome back',
    youAre: "You're a",
    with: 'with',
    keepLearning: 'Keep learning to level up!',
    // Sidebar / Nav
    dashboard: 'Dashboard',
    aiCaseStudio: 'AI Case Studio',
    aiLegalMentor: 'AI Legal Mentor',
    quizMode: 'Quiz Mode',
    caseLibrary: 'Case Library',
    docSimplifier: 'Doc Simplifier',
    communityForum: 'Community Forum',
    lawyerConsult: 'Lawyer Consult',
    legalRoadmap: 'Legal Roadmap',
    draftNotice: 'Draft Notice',
    logout: 'Logout',
    // Footer
    disclaimer: 'Judexia is an educational platform and does not provide official legal advice. All AI outputs shown here are prototype simulations.',
    // Language
    language: 'Language',
    english: 'English',
    hindi: 'Hindi',
  },
  hi: {
    // Auth
    welcomeBack: 'स्वागत है',
    signInContinue: 'सीखना जारी रखने के लिए साइन इन करें',
    email: 'ईमेल',
    password: 'पासवर्ड',
    signIn: 'साइन इन करें',
    signInGoogle: 'Google से साइन इन करें',
    noAccount: 'खाता नहीं है?',
    signUp: 'साइन अप',
    createAccount: 'खाता बनाएं',
    startTraining: 'अपने कानूनी ज्ञान का प्रशिक्षण शुरू करें',
    fullName: 'पूरा नाम',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    alreadyAccount: 'पहले से खाता है?',
    signInLink: 'साइन इन करें',
    orContinueWith: 'या इससे जारी रखें',
    signUpGoogle: 'Google से साइन अप करें',
    passwordMismatch: 'पासवर्ड मेल नहीं खाते',
    trainLegalMind: 'अपना कानूनी दिमाग प्रशिक्षित करें',
    aiPowered: 'AI द्वारा संचालित बुद्धिमान प्रणालियों के साथ।',
    beginJourney: 'अपनी कानूनी यात्रा शुरू करें',
    joinThousands: 'हजारों महत्वाकांक्षी कानूनी पेशेवरों से जुड़ें।',
    // Dashboard
    welcomeBack2: 'वापस स्वागत है',
    youAre: 'आप एक',
    with: 'के साथ',
    keepLearning: 'स्तर बढ़ाने के लिए सीखते रहें!',
    // Sidebar / Nav
    dashboard: 'डैशबोर्ड',
    aiCaseStudio: 'AI केस स्टूडियो',
    aiLegalMentor: 'AI कानूनी गुरु',
    quizMode: 'क्विज़ मोड',
    caseLibrary: 'केस लाइब्रेरी',
    docSimplifier: 'दस्तावेज़ सरलीकरण',
    communityForum: 'समुदाय फ़ोरम',
    lawyerConsult: 'वकील परामर्श',
    legalRoadmap: 'कानूनी रोडमैप',
    draftNotice: 'नोटिस मसौदा',
    logout: 'लॉग आउट',
    // Footer
    disclaimer: 'Judexia एक शैक्षिक मंच है और आधिकारिक कानूनी सलाह नहीं देता। यहाँ दिखाए गए सभी AI आउटपुट प्रोटोटाइप सिमुलेशन हैं।',
    // Language
    language: 'भाषा',
    english: 'अंग्रेज़ी',
    hindi: 'हिंदी',
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  const t = (key: TranslationKey): string => translations[lang][key];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
