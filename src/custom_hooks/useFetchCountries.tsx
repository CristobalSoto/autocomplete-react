// useFetchCountries.tsx
import { useState, useEffect } from 'react';

interface Country {
  name: {
    common: string;
  };
}

export function useFetchCountries(query: string, delay: number = 300) {
  const [suggestions, setSuggestions] = useState<Country[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchCountries = async () => {
      if (!query) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/name/${query}?fields=name`,
          { signal }
        );

        if (!response.ok) {
          setSuggestions([]);
          return;
        }

        const data = await response.json();
        const filtered = data.filter((country: Country) =>
          country.name.common.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered);
      } catch (error) {
          console.error('Failed to fetch countries', error);
      }
    };

    const handler = setTimeout(fetchCountries, delay);

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [query, delay]);

  return suggestions;
}
