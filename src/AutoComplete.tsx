import React, { useState, useEffect } from 'react';
import styles from './AutoComplete.module.css';

interface IAutoCompleteProps {
    placeholder?: string;
}

interface Country {
    name: {
        common: string;
    };
}

const AutoComplete: React.FC<IAutoCompleteProps> = ({ placeholder }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [suggestions, setSuggestions] = useState<Country[]>([]);

    // Implement debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (inputValue) {
                fetch(`https://restcountries.com/v3.1/name/${inputValue}?fields=name`)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        if (data.status) {
                          setSuggestions([])
                        }
                        else {
                          const filteredByCommonName = data.filter((country: Country) =>  country.name.common.toLowerCase().includes(inputValue.toLowerCase()))
                          setSuggestions(filteredByCommonName);
                        }
                    })
                    .catch(error => {
                        console.error('Failed to fetch countries', error);
                    });
            } else {
                setSuggestions([]);
            }
        }, 300);  // Delay in ms

        return () => clearTimeout(timeoutId);
    }, [inputValue]);

    const handleSelectSuggestion = (suggestion: string) => {
        setInputValue(suggestion); // Set the input value to the selected suggestion
        setSuggestions([]);        // Clear suggestions
    };

    return (
        <div className={styles.container}>
            <input
                className={styles.input}
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
            />
            {suggestions.length > 0 && (
                <ul className={styles.suggestions}>
                    {suggestions.map((suggestion, index) => (
                        <li
                            className={styles.suggestionItem}
                            key={index}
                            onClick={() => handleSelectSuggestion(suggestion.name.common)}
                        >
                            {suggestion.name.common.split(new RegExp(`(${inputValue})`, 'gi')).map((part, index) => 
                                part.toLowerCase() === inputValue.toLowerCase() ? <span key={index} className={styles.highlight}>{part}</span> : part
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutoComplete;
