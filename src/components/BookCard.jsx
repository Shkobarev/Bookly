import { BookOpen, Heart } from "lucide-react";
import { getBookCover } from "../services/bookApi";

export default function BookCard({
  book,
  isFavorite,
  onToggleFavorite,
  onSelect,
}) {
  const cover = getBookCover(book);

  return (
    <article
      className="book-card"
      onClick={() => onSelect(book)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(book);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Подробнее о книге ${book.title}`}
    >
      <div className="cover">
        {cover ? (
          <img
            src={cover}
            alt={`Обложка книги ${book.title}`}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <BookOpen size={32} />
        )}
      </div>

      <div className="book-info">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <small>{book.year}</small>
      </div>

      <button
        className={isFavorite ? "heart active" : "heart"}
        onClick={(event) => {
          event.stopPropagation();
          onToggleFavorite(book);
        }}
        aria-label={
          isFavorite
            ? "Удалить из избранного"
            : "Добавить в избранное"
        }
      >
        <Heart
          size={19}
          fill={isFavorite ? "currentColor" : "none"}
        />
      </button>
    </article>
  );
}