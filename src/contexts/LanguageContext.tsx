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
    signingIn: 'Signing in...',
    creatingAccount: 'Creating account...',
    verifyEmail: 'Account created! Please check your email to verify your account.',
    afterVerify: 'After verifying your email, you can',
    signInHere: 'sign in here',
    yourFullName: 'Your full name',
    // Dashboard
    welcomeBack2: 'Welcome back',
    youAre: "You're a",
    with: 'with',
    keepLearning: 'Keep learning to level up!',
    loadingApp: 'Loading Judexia...',
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
    consultRequests: 'Consultation Requests',
    myEarnings: 'My Earnings',
    aboutUs: 'About Us',
    logout: 'Logout',
    legalAIPlatform: 'Legal AI Platform',
    copyright: 'Judexia © 2026',
    // Footer
    disclaimer: 'Judexia is an educational platform and does not provide official legal advice.',
    // Language
    language: 'Language',
    english: 'English',
    hindi: 'Hindi',
    // About page
    aboutJudexia: 'About Judexia',
    aboutSubtitle: 'Train Your Legal Mind with Intelligent Systems',
    legalTechPlatform: 'LegalTech Platform',
    whoWeAre: 'Who We Are',
    whoWeAreText1: 'Judexia is an AI-powered LegalTech learning platform designed to bridge the gap between citizens and the law.',
    whoWeAreText2: 'We transform complex legal systems into interactive case simulations and intelligent guidance tools.',
    ourVision: 'Our Vision',
    visionText: "We envision a future where legal knowledge is accessible, practical, and empowering for every digitally connected citizen. Judexia aims to build India's first AI-powered legal reasoning ecosystem — transforming legal confusion into legal confidence.",
    whatMakesDifferent: 'What Makes Us Different',
    feature1: 'Gamified Legal Reasoning',
    feature1Desc: 'Learn law through interactive case simulations that make legal reasoning engaging and memorable.',
    feature2: 'Conversational AI Mentorship',
    feature2Desc: 'Get personalized guidance from our AI mentor trained on Indian legal frameworks.',
    feature3: 'Document Simplification',
    feature3Desc: 'Complex legal documents translated into plain language you can actually understand.',
    feature4: 'India-Focused Design',
    feature4Desc: "Built specifically for India's legal system with mobile-first, multilingual support.",
    feature5: 'Scalable AI Architecture',
    feature5Desc: 'Enterprise-grade AI infrastructure that grows with your legal learning journey.',
    readyToStart: 'Ready to Start?',
    readyToStartDesc: "Join India's premier AI-powered legal learning platform today.",
    getStarted: 'Get Started',
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
    signingIn: 'साइन इन हो रहा है...',
    creatingAccount: 'खाता बनाया जा रहा है...',
    verifyEmail: 'खाता बनाया गया! कृपया अपना ईमेल सत्यापित करें।',
    afterVerify: 'ईमेल सत्यापन के बाद आप',
    signInHere: 'यहाँ साइन इन करें',
    yourFullName: 'आपका पूरा नाम',
    // Dashboard
    welcomeBack2: 'वापस स्वागत है',
    youAre: 'आप एक',
    with: 'के साथ',
    keepLearning: 'स्तर बढ़ाने के लिए सीखते रहें!',
    loadingApp: 'Judexia लोड हो रहा है...',
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
    consultRequests: 'परामर्श अनुरोध',
    myEarnings: 'मेरी कमाई',
    aboutUs: 'हमारे बारे में',
    logout: 'लॉग आउट',
    legalAIPlatform: 'कानूनी AI मंच',
    copyright: 'Judexia © 2026',
    // Footer
    disclaimer: 'Judexia एक शैक्षिक मंच है और आधिकारिक कानूनी सलाह नहीं देता।',
    // Language
    language: 'भाषा',
    english: 'अंग्रेज़ी',
    hindi: 'हिंदी',
    // About page
    aboutJudexia: 'Judexia के बारे में',
    aboutSubtitle: 'बुद्धिमान प्रणालियों के साथ अपना कानूनी दिमाग प्रशिक्षित करें',
    legalTechPlatform: 'LegalTech मंच',
    whoWeAre: 'हम कौन हैं',
    whoWeAreText1: 'Judexia एक AI-संचालित LegalTech शिक्षण मंच है जो नागरिकों और कानून के बीच की खाई को पाटने के लिए बनाया गया है।',
    whoWeAreText2: 'हम जटिल कानूनी प्रणालियों को इंटरैक्टिव केस सिमुलेशन और बुद्धिमान मार्गदर्शन उपकरणों में बदलते हैं।',
    ourVision: 'हमारी दृष्टि',
    visionText: 'हम एक ऐसे भविष्य की कल्पना करते हैं जहाँ कानूनी ज्ञान प्रत्येक डिजिटल रूप से जुड़े नागरिक के लिए सुलभ, व्यावहारिक और सशक्त हो। Judexia भारत का पहला AI-संचालित कानूनी तर्क पारिस्थितिकी तंत्र बनाने का लक्ष्य रखता है — कानूनी भ्रम को कानूनी आत्मविश्वास में बदलना।',
    whatMakesDifferent: 'हमें क्या अलग बनाता है',
    feature1: 'गेमिफाइड कानूनी तर्क',
    feature1Desc: 'इंटरैक्टिव केस सिमुलेशन के माध्यम से कानून सीखें जो कानूनी तर्क को रोचक और यादगार बनाते हैं।',
    feature2: 'संवादात्मक AI गुरु',
    feature2Desc: 'भारतीय कानूनी ढांचे पर प्रशिक्षित AI गुरु से व्यक्तिगत मार्गदर्शन पाएं।',
    feature3: 'दस्तावेज़ सरलीकरण',
    feature3Desc: 'जटिल कानूनी दस्तावेज़ों को सरल भाषा में अनुवाद करें जो आप वास्तव में समझ सकते हैं।',
    feature4: 'भारत-केंद्रित डिज़ाइन',
    feature4Desc: 'भारत की कानूनी प्रणाली के लिए विशेष रूप से निर्मित, मोबाइल-प्रथम, बहुभाषी समर्थन के साथ।',
    feature5: 'स्केलेबल AI आर्किटेक्चर',
    feature5Desc: 'एंटरप्राइज़-ग्रेड AI बुनियादी ढाँचा जो आपकी कानूनी सीखने की यात्रा के साथ बढ़ता है।',
    readyToStart: 'शुरू करने के लिए तैयार हैं?',
    readyToStartDesc: 'आज भारत के प्रमुख AI-संचालित कानूनी शिक्षण मंच से जुड़ें।',
    getStarted: 'शुरू करें',
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
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem('judexia-lang');
    return (stored === 'hi' ? 'hi' : 'en') as Language;
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('judexia-lang', newLang);
  };

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
