import { useEffect, useState } from "react";

export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("bookly-favorites") || "[]"
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "bookly-favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  function isFavorite(book) {
    return favorites.some((item) => item.key === book.key);
  }

  function toggleFavorite(book) {
    setFavorites((current) =>
      current.some((item) => item.key === book.key)
        ? current.filter((item) => item.key !== book.key)
        : [book, ...current]
    );
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  };
}