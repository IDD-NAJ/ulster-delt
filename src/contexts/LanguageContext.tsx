'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'EN' | 'DE' | 'FR' | 'ES' | 'IT';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<string, string>;
}

const translations = {
  EN: {
    onlineBanking: 'Online Banking',
    openAccount: 'Open Bank Account',
    signIn: 'Sign In',
    username: 'Username',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    register: 'Register',
    accountType: 'Account Type',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email Address',
    phone: 'Phone Number',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit Application',
  },
  DE: {
    onlineBanking: 'Online-Banking',
    openAccount: 'Bankkonto eröffnen',
    signIn: 'Anmelden',
    username: 'Benutzername',
    password: 'Passwort',
    forgotPassword: 'Passwort vergessen?',
    register: 'Registrieren',
    accountType: 'Kontotyp',
    firstName: 'Vorname',
    lastName: 'Nachname',
    email: 'E-Mail-Adresse',
    phone: 'Telefonnummer',
    next: 'Weiter',
    previous: 'Zurück',
    submit: 'Antrag einreichen',
  },
  FR: {
    onlineBanking: 'Banque en ligne',
    openAccount: 'Ouvrir un compte',
    signIn: 'Connexion',
    username: 'Nom d\'utilisateur',
    password: 'Mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    register: 'S\'inscrire',
    accountType: 'Type de compte',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Adresse e-mail',
    phone: 'Numéro de téléphone',
    next: 'Suivant',
    previous: 'Précédent',
    submit: 'Soumettre la demande',
  },
  ES: {
    onlineBanking: 'Banca en línea',
    openAccount: 'Abrir cuenta',
    signIn: 'Iniciar sesión',
    username: 'Usuario',
    password: 'Contraseña',
    forgotPassword: '¿Olvidó su contraseña?',
    register: 'Registrarse',
    accountType: 'Tipo de cuenta',
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    next: 'Siguiente',
    previous: 'Anterior',
    submit: 'Enviar solicitud',
  },
  IT: {
    onlineBanking: 'Online Banking',
    openAccount: 'Apri un conto',
    signIn: 'Accedi',
    username: 'Nome utente',
    password: 'Password',
    forgotPassword: 'Password dimenticata?',
    register: 'Registrati',
    accountType: 'Tipo di conto',
    firstName: 'Nome',
    lastName: 'Cognome',
    email: 'Indirizzo email',
    phone: 'Numero di telefono',
    next: 'Avanti',
    previous: 'Indietro',
    submit: 'Invia richiesta',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('EN');

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      translations: translations[language],
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 