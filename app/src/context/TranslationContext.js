import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'pa', label: 'Punjabi' },
  { code: 'mr', label: 'Marathi' },
  { code: 'bn', label: 'Bengali' }
];

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [locale, setLocale] = useState('en');
  const [cache, setCache] = useState({});

  useEffect(() => {
    // Restore locale on mount
    const boot = async () => {
      const savedLocale = await AsyncStorage.getItem('@locale');
      if (savedLocale) setLocale(savedLocale);
      
      const savedCache = await AsyncStorage.getItem('@trans_cache');
      if (savedCache) setCache(JSON.parse(savedCache));
    };
    boot();
  }, []);

  const changeLanguage = async (newLocale) => {
    setLocale(newLocale);
    await AsyncStorage.setItem('@locale', newLocale);
  };

  /**
   * The core dynamically evaluating translation hook.
   * Checks the native device cache first, if it misses, talks to Node Backend.
   */
  const translate = async (text) => {
    if (locale === 'en' || !text) return text;
    
    // Check purely local client cache
    const cacheKey = `${locale}:${text}`;
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    try {
      // Determine the correct API URL based on platform/environment
      const API_BASE_URL = Platform.OS === 'web' 
        ? '' // Use relative path for web since it's hosted by the backend
        : (process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8080');

      const response = await fetch(`${API_BASE_URL}/api/translation/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texts: [text], targetLanguage: locale })
      });
      
      const json = await response.json();
      const translatedText = json.translations ? json.translations[0] : text;

      // Ensure cache is updated so we never hit the API for this word again
      const newCache = { ...cache, [cacheKey]: translatedText };
      setCache(newCache);
      await AsyncStorage.setItem('@trans_cache', JSON.stringify(newCache));

      return translatedText;
    } catch (e) {
      console.warn("Translation backend unavailable. Returning mock cache mapping");
      // Fallback pseudo-translation for UI testing if server connection goes down
      return `${text} (${locale})`;
    }
  };

  return (
    <TranslationContext.Provider value={{ locale, changeLanguage, translate }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
