import { describe, expect, it } from "vitest";
import { favoriteProductId } from "./favorites";

describe("favoriteProductId", () => {
  it("creates stable ids shared by catalog and Lookbook", () => {
    expect(favoriteProductId("Raven Hour")).toBe("raven-hour");
    expect(favoriteProductId("  Black Fig  ")).toBe("black-fig");
  });

  it("normalizes punctuation without creating empty edge segments", () => {
    expect(favoriteProductId("The Last Séance")).toBe("the-last-seance");
    expect(favoriteProductId(" / Nocturne / ")).toBe("nocturne");
  });
});
