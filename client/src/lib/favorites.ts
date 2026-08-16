export const FAVORITES_STORAGE_KEY = "night-market-favorites";

export function readFavoriteIds(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function favoriteProductId(title: string): string {
  return title.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9а-яё]+/gi, "-").replace(/^-|-$/g, "");
}

export function writeFavoriteIds(ids: string[]) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent("night-market-favorites", { detail: ids }));
}
