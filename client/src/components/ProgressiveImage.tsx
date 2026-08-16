import { useState } from "react";

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
  const canTransform = source.includes("files.manuscdn.com");
  const widths = [480, 768, 1200, 1600];
  const variant = (format: string, width: number) => `${source}${source.includes("?") ? "&" : "?"}format=${format}&width=${width}`;
  const derivedSrcSet = canTransform && !srcSet ? widths.map((width) => `${variant("jpg", width)} ${width}w`).join(", ") : srcSet;
  const derivedWebpSrcSet = canTransform && !webpSrcSet ? widths.map((width) => `${variant("webp", width)} ${width}w`).join(", ") : webpSrcSet;
  const derivedAvifSrcSet = canTransform && !avifSrcSet ? widths.map((width) => `${variant("avif", width)} ${width}w`).join(", ") : avifSrcSet;
  const responsiveSizes = sizes || "(max-width: 680px) 92vw, (max-width: 1200px) 50vw, 1200px";
  return <span className={`nm-progressive-image nm-progressive-image-${status} ${className}`}>
    {status === "loading" && <span className="nm-image-progress" role="progressbar" aria-label={`Loading ${alt || "image"}`} aria-valuemin={0} aria-valuemax={100}><span /></span>}
    {status === "error" && <span className="nm-image-error" role="img" aria-label={`${alt || "Image"} unavailable`}>Image unavailable</span>}
    <picture>
      {derivedAvifSrcSet && <source type="image/avif" srcSet={derivedAvifSrcSet} sizes={responsiveSizes} />}
      {derivedWebpSrcSet && <source type="image/webp" srcSet={derivedWebpSrcSet} sizes={responsiveSizes} />}
      <img {...props} src={src} srcSet={derivedSrcSet} sizes={responsiveSizes} alt={alt} className={imgClassName} onLoad={() => setStatus("loaded")} onError={() => setStatus("error")} />
    </picture>
  </span>;
}
