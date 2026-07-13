import { useEffect, useRef, useState } from "react";
import api from "../api/axios";

function SearchBar({ onSelect, placeholder = "Buscar película..." }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);

    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get("/search", { params: { query } });
        setResults(res.data);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timerRef.current);
  }, [query]);

  const handleSelect = (item) => {
    onSelect(item);
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div className="search-bar">
      <input
        className="input"
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {loading && <span className="search-bar-loading">Buscando...</span>}

      {open && results.length > 0 && (
        <ul className="search-bar-results">
          {results.map((item) => (
            <li key={item.externalId} onClick={() => handleSelect(item)}>
              <div className="search-bar-poster">
                {item.poster ? <img src={item.poster} alt={item.title} /> : "🎬"}
              </div>
              <div>
                <p className="search-bar-title">{item.title}</p>
                {item.year && <p className="search-bar-year">{item.year}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
