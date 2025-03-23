//@ts-nocheck
import { useCallback, useRef, useState } from "react";
import AutoComplete from "./components/Autocomplete";
import { fetchMockData } from "./service/api";
import "./styles.css";
import { debounce } from "./utils/helper";

export default function App() {

  const [selectedValue, setSelectedValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const cache = useRef<Map<string, Suggestion[]>>(new Map());

  // Highlight the matched text
  const highlightMatch = (text: string, query: string) => {
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={index} style={{ backgroundColor: "yellow" }}>{part}</strong>
      ) : (
        part
      )
    );
  };

  const fetchUsers = (query: string) => {
    return fetch(`https://jsonplaceholder.typicode.com/users?name_like=${query}`).then((res) => res.json());
  };

  const onFetchSuggestions = (query: string) => {
    if(query.length === 0){
      setSuggestions([]);
      return;
    }
    if (cache.current.has(query)) {
      setSuggestions(cache.current.get(query) as Suggestion[]);
      return;
    }else{
      fetchUsers(query).then((data) => {
        cache.current.set(query, data)
        setSuggestions(data);
      });
    }

  }

  const debouncedFetchSuggestions = useCallback(debounce (onFetchSuggestions, 300), []);

  // Custom Renderer for suggestions container
  const renderSuggestionsContainer = (children: React.ReactElement[], query?: string ) => {
    if(suggestions.length === 0){
      return (
        <div className="suggestions-container" >
          <p>No suggestions</p>
        </div>
      )
    }
    return (
      <div className="suggestions-container" >
        <div style={{border: "1px solid grey",borderBottom: "1px solid red",fontSize: 14, padding: "20px 0"}}>Suggestions:</div>
        {children}
      </div>
    )
    ;
  }
  const renderSuggestions = (suggestions: Suggestion[], { query, highlightIndex }: { query: string, highlightIndex?: number }) => {
      return suggestions.map((item: Suggestion,index) => {
        const isHighlighted = highlightIndex === index;
        return (
          <div key={item.id} className={`suggestion-item ${isHighlighted? "suggestion-active":''}`} style={{ padding: "10px", border: "1px solid lightgray" }}>
            {highlightMatch(item.name, query)}
          </div>
        )

      });
  }

  const onSuggestionSelected = (suggestion: Suggestion) => {
    setSelectedValue(suggestion.name);
    setSuggestions([]);
  }

  const onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if(e.target.value.length>0){
      debouncedFetchSuggestions(e.target.value);
    }
  }

  
  const inputProps = {
    onFocus: onInputFocus,
    placeholder: "Search Users...",
    title: "Search Users...",
    style: {width: "100%", padding: "20px", fontSize: 16}
  }


  return (
    <div className="App">
      <h1>Search you favourite</h1>
        <h2>Lets begin the search: Eg: Type Le</h2>
      {selectedValue.length> 0 ? <h3 style={{color: "red"}}>Selected User: {selectedValue}</h3>: null}

      <AutoComplete 
        onFetchRequested={debouncedFetchSuggestions}
        renderSuggestions={renderSuggestions}
        onSuggestionSelected={onSuggestionSelected}
        suggestions={suggestions}
        renderSuggestionsContainer={renderSuggestionsContainer}
        inputProps={inputProps}
      />
    </div>
  );
}