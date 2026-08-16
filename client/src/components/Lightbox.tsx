import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import ProgressiveImage from "@/components/ProgressiveImage";

type LightboxImage = { src: string; alt: string; title?: string };
type LightboxProps = LightboxImage & { images?: LightboxImage[]; onClose: () => void };

export default function Lightbox({ src, alt, title, images = [{ src, alt, title }], onClose }: LightboxProps) {
  const initialIndex = Math.max(0, images.findIndex((image) => image.src === src));
  const [index, setIndex] = useState(initialIndex);
  const closeRef = useRef<HTMLButtonElement>(null);
  const current = images[index] || images[0];
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key === "ArrowLeft" && images.length > 1) { event.preventDefault(); setIndex((value) => (value - 1 + images.length) % images.length); return; }
      if (event.key === "ArrowRight" && images.length > 1) { event.preventDefault(); setIndex((value) => (value + 1) % images.length); return; }
      if (event.key !== "Tab") return;
      const focusable = Array.from(document.querySelectorAll<HTMLElement>(".nm-lightbox button, .nm-lightbox [href], .nm-lightbox [tabindex]:not([tabindex='-1'])"));
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.body.classList.add("nm-lightbox-open");
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.classList.remove("nm-lightbox-open"); window.removeEventListener("keydown", onKeyDown); previous?.focus(); };
  }, [images.length, onClose]);
  return <div className="nm-lightbox" role="dialog" aria-modal="true" aria-label={current.title ? `${current.title} image` : "Image preview"} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><button ref={closeRef} className="nm-lightbox-close" onClick={onClose} aria-label="Close image preview"><X size={20} /></button>{images.length > 1 && <><button className="nm-lightbox-nav nm-lightbox-prev" onClick={() => setIndex((value) => (value - 1 + images.length) % images.length)} aria-label="Previous image"><ChevronLeft size={24} /></button><button className="nm-lightbox-nav nm-lightbox-next" onClick={() => setIndex((value) => (value + 1) % images.length)} aria-label="Next image"><ChevronRight size={24} /></button></>}<div className="nm-lightbox-content"><ProgressiveImage src={current.src} alt={current.alt} className="nm-lightbox-image" /><div className="nm-lightbox-caption"><ZoomIn size={14} /><span>{current.title || current.alt}</span>{images.length > 1 && <small>{index + 1} / {images.length}</small>}</div></div></div>;
}
