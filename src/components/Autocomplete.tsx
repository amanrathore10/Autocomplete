import React, { useState, useEffect } from "react";
import { isNonEmptyArray } from "../utils/helper";
import './style.css';


interface AutoCompleteProps {
    onFetchRequested: (query: string) => void;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    debounceDelay?: number;
    renderSuggestions?: (suggestions: Suggestion[], { query, highlightIndex }: { query: string, highlightIndex?:number }) => React.ReactElement[];
    suggestions: Suggestion[];
    onSuggestionSelected?: (suggestion: Suggestion) => void
    renderSuggestionsContainer?: (children: React.ReactElement[], query?: string) => React.ReactElement;
}

const AutoComplete: React.FC<AutoCompleteProps> = (props: AutoCompleteProps) => {
  const { onFetchRequested, inputProps = {}, renderSuggestions, onSuggestionSelected, suggestions, renderSuggestionsContainer } = props;
  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);

  useEffect(() => {
    onFetchRequested(query);
  },[query]);

  // Handle key events for navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {

      setHighlightIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));

    } else if (e.key === "ArrowUp") {

      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : prev));
      
    } else if (e.key === "Enter" && highlightIndex >= 0) {

      setHighlightIndex(-1);
      onSuggestionSelected && onSuggestionSelected(suggestions[highlightIndex]);
    }
  };

  const onSuggestClick = (suggestion: Suggestion) => {
    onSuggestionSelected && onSuggestionSelected(suggestion);
    setQuery("");
  }

  return (
    <div className="autocompleteContainer">
      <div className={`inputWrapper`}>
        <input
            autoComplete="off"
            aria-autocomplete="list"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder=""
            className="autocompleteInput"
            title={inputProps.placeholder || "Search"}
            {...inputProps}

        />
      </div>

      {
        isNonEmptyArray(suggestions) && renderSuggestions && 
            <AutoSuggestSuggestions  renderSuggestionsContainer={renderSuggestionsContainer} query={query}>
                {React.Children.map(renderSuggestions(suggestions, {query, highlightIndex}), (child, index) => {

                    return (
                        <li role="option" id={`react-autoselect-${index}`} aria-selected={highlightIndex === index} className="react-autosuggest__suggestion react-autosuggest__suggestion--first" >
                            {
                            React.cloneElement(child, {
                                key: suggestions[index].id, // Ensure unique keys for performance
                                onClick: (e: React.MouseEvent<HTMLDivElement>) => {
                                    onSuggestionSelected && onSuggestClick(suggestions[index]);
                                }

                            })}
                        </li>
                    )
                    ;
                })}
            </AutoSuggestSuggestions>
      }

    </div>
  );
};

type SuggestionContainerType = {
    children: React.ReactElement[];
    query?: string;
    renderSuggestionsContainer?: (children: React.ReactElement[], query?: string) => React.ReactElement;
} 

const AutoSuggestSuggestions = ({children, renderSuggestionsContainer, query}: SuggestionContainerType)=>{
    const renderSuggestions = (query:string) => {
        if(renderSuggestionsContainer){
            // Rendering custom container for suggestions
            return renderSuggestionsContainer(children, query);
        }else{
            return (
                <div className="suggestions-container">
                    {children}
                </div>
            )
        }
    }
    return (
        <div role="combobox" aria-haspopup="listbox" aria-expanded="true" >
            <ul role="listbox" className="react-autosuggest__suggestions-list">
                {renderSuggestions(query as string)}
            </ul>
        </div>
    )
}



export default AutoComplete;