import { useEffect, useState } from "react";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import BookCard from "./components/BookCard";
import BookDetails from "./components/BookDetails";

import {
  searchBooks,
  getBookDetails,
} from "./services/bookApi";

import useFavorites from "./hooks/useFavorites";

import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 12;

export default function App() {
  const [query, setQuery] = useState("fantasy");
  const [searchTerm, setSearchTerm] = useState("fantasy");

  const [books, setBooks] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedBook, setSelectedBook] = useState(null);
  const [bookDetails, setBookDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (showFavorites) return;

    let active = true;

    async function loadBooks() {
      setLoading(true);
      setError("");

      try {
        const result = await searchBooks(
          searchTerm,
          page,
          PAGE_SIZE
        );

        if (active) {
          setBooks(result.books);
          setTotal(result.total);
        }
      } catch {
        if (active) {
          setError("Не удалось загрузить книги. Попробуй ещё раз.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBooks();

    return () => {
      active = false;
    };
  }, [searchTerm, page, showFavorites]);

  useEffect(() => {
    if (!selectedBook) {
      setBookDetails(null);
      return;
    }

    let active = true;

    async function loadDetails() {
      setDetailsLoading(true);
      setBookDetails(null);

      try {
        const details = await getBookDetails(selectedBook.key);

        if (active) {
          setBookDetails(details);
        }
      } catch {
        if (active) {
          setBookDetails({
            description: "Не удалось загрузить описание книги.",
          });
        }
      } finally {
        if (active) {
          setDetailsLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      active = false;
    };
  }, [selectedBook]);

  function handleSearch(event) {
    event.preventDefault();

    setPage(1);
    setShowFavorites(false);
    setSelectedBook(null);

    if (!query.trim()) {
      setQuery("");
      setSearchTerm("subject:fiction");
      return;
    }

    setSearchTerm(query.trim());
  }

  function retrySearch() {
    setSearchTerm((value) => value + " ");
  }

  const visibleBooks = showFavorites ? favorites : books;
  const pages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="app">
      <Header
        favoritesCount={favorites.length}
        showFavorites={showFavorites}
        onToggleFavorites={() => {
          setShowFavorites((value) => !value);
          setSelectedBook(null);
        }}
      />

      <main>
        <SearchBar
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
        />

        <h2>
          {showFavorites ? "Избранное" : "Список книг"}
        </h2>

        {loading && !showFavorites && (
          <p className="message">Загрузка книг...</p>
        )}

        {error && !showFavorites && (
          <p className="message">
            {error}
            <button onClick={retrySearch}>Повторить</button>
          </p>
        )}

        {!loading && !error && visibleBooks.length === 0 && (
          <p className="message">
            {showFavorites
              ? "Пока нет избранных книг. Нажми на сердечко у книги."
              : "Книги не найдены. Попробуй другой запрос."}
          </p>
        )}

        <div className="catalog-layout">
          <div className="book-grid">
            {visibleBooks.map((book) => (
              <BookCard
                key={book.key}
                book={book}
                isFavorite={isFavorite(book)}
                onToggleFavorite={toggleFavorite}
                onSelect={setSelectedBook}
              />
            ))}
          </div>

          {selectedBook && (
            <BookDetails
              book={selectedBook}
              details={bookDetails}
              loading={detailsLoading}
              isFavorite={isFavorite(selectedBook)}
              onToggleFavorite={toggleFavorite}
              onClose={() => setSelectedBook(null)}
            />
          )}
        </div>

        {!showFavorites &&
          !loading &&
          !error &&
          pages > 1 && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((value) => value - 1)}
              >
                <ChevronLeft size={18} />
              </button>

              <span>{page} / {pages}</span>

              <button
                disabled={page >= pages}
                onClick={() => setPage((value) => value + 1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
      </main>
    </div>
  );
}