import { describe, expect, it } from "vitest";
import { getTelegramSuccessMotion, TELEGRAM_SUCCESS_EXIT_MS } from "./telegramMotion";

describe("Telegram success motion", () => {
  it("uses opacity-only variants when reduced motion is enabled", () => {
    const motion = getTelegramSuccessMotion(true);
    expect(motion.initial).toEqual({ opacity: 0 });
    expect(motion.animate).toEqual({ opacity: 1 });
    expect(motion.exit).toEqual({ opacity: 0 });
  });

  it("keeps the editorial slide and scale transition for normal motion", () => {
    const motion = getTelegramSuccessMotion(false);
    expect(motion.initial).toEqual({ opacity: 0, y: 18, scale: 0.96 });
    expect(motion.animate).toEqual({ opacity: 1, y: 0, scale: 1 });
    expect(motion.exit).toEqual({ opacity: 0, y: 10, scale: 0.98 });
    expect(TELEGRAM_SUCCESS_EXIT_MS).toBeGreaterThan(0);
  });
});

