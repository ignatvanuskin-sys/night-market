import { useState } from "react";

type ProgressiveImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "className" | "onLoad" | "onError"> & {
  className?: string;
  imgClassName?: string;
};

export default function ProgressiveImage({ src, alt, className = "", imgClassName = "", ...props }: ProgressiveImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <span className={`nm-progressive-image nm-progressive-image-${status} ${className}`}>
      {status === "loading" && <span className="nm-image-progress" role="progressbar" aria-label={`Loading ${alt || "image"}`} aria-valuemin={0} aria-valuemax={100}><span /></span>}
      {status === "error" && <span className="nm-image-error" role="img" aria-label={`${alt || "Image"} unavailable`}>Image unavailable</span>}
      <img
        {...props}
        src={src}
        alt={alt}
        className={imgClassName}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
    </span>
  );
}
