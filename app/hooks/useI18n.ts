'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define the type for our messages
type Messages = {
  [key: string]: any;
};

// Load messages for a given locale
async function loadMessages(locale: string): Promise<Messages> {
  try {
    // Use absolute URL to ensure we're always fetching from the root
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const response = await fetch(`${baseUrl}/messages/${locale}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load messages for locale: ${locale}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading messages:', error);
    // Fallback to English if loading fails
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const fallbackResponse = await fetch(`${baseUrl}/messages/en.json`);
    return await fallbackResponse.json();
  }
}

export function useI18n() {
  const router = useRouter();
  // Get initial locale from URL
  const getInitialLocale = (): string => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const languagePrefix = pathname.split('/')[1];
      return ['zh', 'en'].includes(languagePrefix) ? languagePrefix : 'zh';
    }
    return 'zh'; // Default to Chinese if window is not available
  };
  const [locale, setLocale] = useState<string>(getInitialLocale());
  const [messages, setMessages] = useState<Messages>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Load messages when locale changes
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const loadedMessages = await loadMessages(locale);
      setMessages(loadedMessages);
      setLoading(false);
    };

    fetchMessages();
  }, [locale]);

  // Change locale and update URL
  const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
    // Update the URL with the new locale
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      
      // Check if the current path already has a language prefix
      const languagePrefix = currentPath.split('/')[1];
      
      let newPath: string;
      if (['zh', 'en'].includes(languagePrefix)) {
        // Replace existing language prefix
        newPath = `/${newLocale}${currentPath.substring(3)}`;
      } else {
        // Add new language prefix
        newPath = `/${newLocale}${currentPath}`;
      }
      
      // Use window.location.href for full page reload to avoid RSC issues
      window.location.href = `${newPath}${currentSearch}`;
    }
  };

  // Get a translation for a key
  const t = (key: string, fallback: string = key): string => {
    const keys = key.split('.');
    let value: any = messages;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback;
      }
    }
    
    return typeof value === 'string' ? value : fallback;
  };

  return {
    locale,
    messages,
    loading,
    changeLocale,
    t,
  };
}
