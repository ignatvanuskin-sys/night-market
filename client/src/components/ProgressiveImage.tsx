import { useState } from "react";
import { mediaSrcSet } from "@/lib/media";

type ProgressiveImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "className" | "onLoad" | "onError" | "srcSet" | "sizes"> & {
  className?: string;
  imgClassName?: string;
  srcSet?: string;
  sizes?: string;
  avifSrcSet?: string;
  webpSrcSet?: string;
};

export default function ProgressiveImage({ src, alt, className = "", imgClassName = "", srcSet, sizes, avifSrcSet, webpSrcSet, ...props }: ProgressiveImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const source = typeof src === "string" ? src : "";
  const derivedSrcSet = srcSet;
  const derivedWebpSrcSet = webpSrcSet || mediaSrcSet(source, "webp");
  const derivedAvifSrcSet = avifSrcSet || mediaSrcSet(source, "avif");
  const responsiveSizes = sizes || "(max-width: 680px) 92vw, (max-width: 1200px) 50vw, 1200px";
  const validFormatSource = (value: string | undefined, extension: string) => Boolean(value && value.split(", ").every((entry) => entry.split(" ")[0].toLowerCase().split("?")[0].endsWith(extension)));
  const safeAvifSrcSet = validFormatSource(derivedAvifSrcSet, ".avif") ? derivedAvifSrcSet : undefined;
  const safeWebpSrcSet = validFormatSource(derivedWebpSrcSet, ".webp") ? derivedWebpSrcSet : undefined;
  return <span className={`nm-progressive-image nm-progressive-image-${status} ${className}`}>
    {status === "loading" && <span className="nm-image-progress" role="progressbar" aria-label={`Loading ${alt || "image"}`} aria-valuemin={0} aria-valuemax={100}><span /></span>}
    {status === "error" && <span className="nm-image-error" role="img" aria-label={`${alt || "Image"} unavailable`}>Image unavailable</span>}
    <picture>
      {safeAvifSrcSet && <source type="image/avif" srcSet={safeAvifSrcSet} sizes={responsiveSizes} />}
      {safeWebpSrcSet && <source type="image/webp" srcSet={safeWebpSrcSet} sizes={responsiveSizes} />}
      <img {...props} src={src} srcSet={derivedSrcSet} sizes={responsiveSizes} alt={alt} className={imgClassName} onLoad={() => setStatus("loaded")} onError={() => setStatus("error")} />
    </picture>
  </span>;
}
