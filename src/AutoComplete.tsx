// AutoComplete.tsx
import React, { useState, useCallback } from 'react';
import styles from './AutoComplete.module.css';
import { useWebSocket } from './custom_hooks/useWebSocket';
import { useFetchCountries } from './custom_hooks/useFetchCountries';

interface IAutoCompleteProps {
  placeholder?: string;
}
interface CountryData {
  [key: string]: any;
}

const AutoComplete: React.FC<IAutoCompleteProps> = ({ placeholder }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const suggestions = useFetchCountries(inputValue);
  const { completionPercentage, data: countryData, sendMessage } = useWebSocket<CountryData[]>('ws://localhost:8080');

  const handleSelectSuggestion = useCallback(
    (suggestion: string) => {
      setInputValue(suggestion);
      sendMessage(suggestion);
    },
    [sendMessage]
  );

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((suggestion, index) => (
            <li
              className={styles.suggestionItem}
              key={index}
              onClick={() => handleSelectSuggestion(suggestion.name.common)}
            >
              {suggestion.name.common}
            </li>
          ))}
        </ul>
      )}
      <div className={styles.completion}>
        {completionPercentage === 100 ? 'Load complete ' : 'Waiting for data '}
        {completionPercentage}%
      </div>

      {countryData && countryData.length > 0 && (
        <div className={styles.countryData}>
          <h4>Country Data:</h4>
          <ul>
            <pre className={styles.jsonOutput}>{JSON.stringify(countryData[0], null, 2)}</pre>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
