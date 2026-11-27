import { BookOpen, Heart, X } from "lucide-react";
import { getBookCover } from "../services/bookApi";

export default function BookDetails({
  book,
  details,
  loading,
  isFavorite,
  onToggleFavorite,
  onClose,
}) {
  if (!book) return null;

  const cover = getBookCover(book);

  return (
    <aside className="book-details">
      <button
        className="details-close"
        onClick={onClose}
        aria-label="Закрыть подробности"
      >
        <X size={20} />
      </button>

      <div className="details-cover">
        {cover ? (
          <img src={cover} alt={`Обложка книги ${book.title}`} />
        ) : (
          <BookOpen size={40} />
        )}
      </div>

      <h2>{book.title}</h2>
      <p className="details-author">{book.author}</p>
      <p className="details-year">Год издания: {book.year}</p>

      <button
        className={
          isFavorite
            ? "details-favorite active"
            : "details-favorite"
        }
        onClick={() => onToggleFavorite(book)}
      >
        <Heart
          size={18}
          fill={isFavorite ? "currentColor" : "none"}
        />
        {isFavorite ? "В избранном" : "Добавить в избранное"}
      </button>

      <div className="details-description">
        <h3>Описание</h3>

        {loading ? (
          <p>Загружаем описание...</p>
        ) : (
          <p>
            {details?.description ||
              "Описание для этой книги отсутствует."}
          </p>
        )}
      </div>
    </aside>
  );
}