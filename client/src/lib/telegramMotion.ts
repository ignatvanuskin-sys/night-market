export type TelegramSuccessMotion = {
  initial: { opacity: number; y?: number; scale?: number };
  animate: { opacity: number; y?: number; scale?: number };
  exit: { opacity: number; y?: number; scale?: number };
};

export const getTelegramSuccessMotion = (reducedMotion: boolean): TelegramSuccessMotion => reducedMotion
  ? {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    }
  : {
      initial: { opacity: 0, y: 18, scale: 0.96 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 10, scale: 0.98 },
    };

export const TELEGRAM_SUCCESS_EXIT_MS = 220;

export default getTelegramSuccessMotion;

