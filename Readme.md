# React AutoComplete Component

A customizable autocomplete/typeahead component with async suggestions fetching and accessibility support.

## Features

- Controlled input and suggestions rendering
- Keyboard navigation (↑/↓ arrows, Enter)
- Support for input events like blur, focus etc.
- onSelection handling
- Customizable input rendering
- Custom suggestion rendering
- Customizable suggestions container
- Accessibility (ARIA-compliant)
- TypeScript support
- Custom query length validation

## Installation and Usage

### Unzip the repo

### Install dependencies:

```bash
npm install
npm start
```

server will run on localhost:3000

### Execute Tests:

```bash
npm test
```

### Demo use cases -

```
        import Autocomplete from './Autocomplete'
        const App = () => {
        const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

        const handleSearch = (query: string) => {
            // Fetch suggestions from API
            fetch(`/api/search?q=${query}`)
            .then(res => res.json())
            .then(setSuggestions);
        };

        return (
            <AutoComplete
            onFetchRequested={handleSearch}
            suggestions={suggestions}
            renderSuggestions={(suggestions) => 
                suggestions.map(s => <div key={s.id}>{s.text}</div>)
            }
            inputProps={{ 
                placeholder: 'Search countries...',
                'data-testid': 'search-input'
            }}
            />
        );
        };
```


```
<AutoComplete
  onFetchRequested={fetchSuggestions}
  suggestions={results}
  renderSuggestions={(suggestions, { highlightIndex }) => 
    suggestions.map((s, index) => (
      <div 
        key={s.id}
        className={`suggestion-item ${highlightIndex === index ? 'highlighted' : ''}`}
        data-testid={`suggestion-${index}`}
      >
        <img src={s.flag} alt={s.name}/>
        <span>{s.name}</span>
        <span className="population">{s.population.toLocaleString()}</span>
      </div>
    ))
  }
  renderSuggestionsContainer={(children) => (
    <div className="custom-suggestions">
      <h3>Search Results</h3>
      <div className="results-list">
        {children}
      </div>
      <footer className="search-footer">Powered by Search API</footer>
    </div>
  )}
/>

```
