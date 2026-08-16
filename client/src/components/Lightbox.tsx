import { useEffect, useRef } from "react";
import { X, ZoomIn } from "lucide-react";
import ProgressiveImage from "@/components/ProgressiveImage";

type LightboxProps = { src: string; alt: string; title?: string; onClose: () => void };

export default function Lightbox({ src, alt, title, onClose }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
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
  }, [onClose]);
  return <div className="nm-lightbox" role="dialog" aria-modal="true" aria-label={title ? `${title} image` : "Image preview"} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><button ref={closeRef} className="nm-lightbox-close" onClick={onClose} aria-label="Close image preview"><X size={20} /></button><div className="nm-lightbox-content"><ProgressiveImage src={src} alt={alt} className="nm-lightbox-image" /><div className="nm-lightbox-caption"><ZoomIn size={14} /><span>{title || alt}</span></div></div></div>;
}
