import { BookOpen, Heart } from "lucide-react";

export default function Header({
  favoritesCount,
  showFavorites,
  onToggleFavorites,
}) {
  return (
    <header className="header">
      <h1>
        <BookOpen size={26} />
        Bookly
      </h1>

      <button
        className={
          showFavorites
            ? "favorites-button active"
            : "favorites-button"
        }
        onClick={onToggleFavorites}
      >
        <Heart size={17} />
        Избранное ({favoritesCount})
      </button>
    </header>
  );
}