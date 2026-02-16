import { useRef, useEffect } from 'react';
import type { GraphNode } from '../types/graph';

interface Props {
  query: string;
  onQueryChange: (query: string) => void;
  results: GraphNode[];
  onResultClick: (node: GraphNode) => void;
}

export const SearchBar = ({ query, onQueryChange, results, onResultClick }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleResultClick = (node: GraphNode) => {
    onResultClick(node);
    onQueryChange(''); // Clear search after selecting
  };

  const handleClear = () => {
    onQueryChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <svg
          className="search-icon"
          width="18"
          height="18"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search concepts... (Ctrl+K)"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        {query && (
          <button className="clear-btn" onClick={handleClear} aria-label="Clear search">
            ✕
          </button>
        )}
        <kbd className="search-kbd">⌘K</kbd>
      </div>

      {results.length > 0 && (
        <div className="search-results">
          {results.map((node) => (
            <button
              key={node.id}
              className="search-result-item"
              onClick={() => handleResultClick(node)}
            >
              <div className="result-name">{node.name}</div>
              <div className="result-category">{node.category}</div>
              <div className="result-description">
                {node.description.substring(0, 100)}
                {node.description.length > 100 ? '...' : ''}
              </div>
            </button>
          ))}
        </div>
      )}

      {query && results.length === 0 && (
        <div className="search-results">
          <div className="no-results">
            <span>No concepts found for "{query}"</span>
          </div>
        </div>
      )}
    </div>
  );
};
