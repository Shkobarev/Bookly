import { Search } from "lucide-react";

export default function SearchBar({ query, setQuery, onSearch }) {
  return (
    <form className="search" onSubmit={onSearch}>
      <Search size={18} />

      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Название книги или автор"
      />

      <button type="submit">Найти</button>
    </form>
  );
}