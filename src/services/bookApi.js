const API_URL = "https://openlibrary.org/search.json";

export async function searchBooks(query, page = 1, limit = 12) {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    limit: String(limit),
    fields: "key,title,author_name,first_publish_year,cover_i",
  });

  const response = await fetch(`${API_URL}?${params}`);

  if (!response.ok) {
    throw new Error("Не удалось загрузить книги");
  }

  const data = await response.json();

  return {
    books: (data.docs || []).map((book) => ({
      key: book.key,
      title: book.title || "Без названия",
      author: book.author_name?.[0] || "Автор неизвестен",
      year: book.first_publish_year || "Год неизвестен",
      cover_i: book.cover_i,
    })),
    total: data.numFound || 0,
  };
}

export function getBookCover(book) {
  return book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : "";
}

export async function getBookDetails(bookKey) {
  const response = await fetch(
    `https://openlibrary.org${bookKey}.json`
  );

  if (!response.ok) {
    throw new Error("Не удалось загрузить описание книги");
  }

  const data = await response.json();

  const description =
    typeof data.description === "string"
      ? data.description
      : data.description?.value || "";

  return {
    description: description || "Описание для этой книги отсутствует.",
  };
}