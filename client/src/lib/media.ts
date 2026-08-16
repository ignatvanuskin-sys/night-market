type ResponsiveMedia = {
  webp: Record<number, string>;
  avif: Record<number, string>;
};

const storage = (name: string) => `/manus-storage/${name}`;

const mediaBySource: Record<string, ResponsiveMedia> = {
  "XgTNBfpPRvrnTFPr.jpg": {
    webp: { 480: storage("hero-480_7580df52.webp"), 768: storage("hero-768_06813f99.webp"), 1200: storage("hero-1200_d77a1625.webp") },
    avif: { 480: storage("hero-480_09c94d8d.avif"), 768: storage("hero-768_70e02033.avif"), 1200: storage("hero-1200_1bf68ab4.avif") },
  },
  "lCrSqnLAXFKXmWXd.jpg": {
    webp: { 480: storage("category-480_5a899b9b.webp"), 768: storage("category-768_ad6862e3.webp"), 1200: storage("category-1200_fd1a4a9f.webp") },
    avif: { 480: storage("category-480_a60499af.avif"), 768: storage("category-768_d3f7510f.avif"), 1200: storage("category-1200_37710d0c.avif") },
  },
  "RCOUOqqGlNukXVjv.jpg": {
    webp: { 480: storage("raven-480_7bce353f.webp"), 768: storage("raven-768_e8f277e3.webp"), 1200: storage("raven-1200_f1f6da25.webp") },
    avif: { 480: storage("raven-480_c8016905.avif"), 768: storage("raven-768_25a79a6f.avif"), 1200: storage("raven-1200_81d29dfe.avif") },
  },
  "lJJsOdgSMDOjJmdQ.jpg": {
    webp: { 480: storage("nocturne-480_6d1ef948.webp"), 768: storage("nocturne-768_6cf3fcca.webp"), 1200: storage("nocturne-1200_f8c7f59e.webp") },
    avif: { 480: storage("nocturne-480_695d9d10.avif"), 768: storage("nocturne-768_2bdee338.avif"), 1200: storage("nocturne-1200_8900bf9d.avif") },
  },
  "FcXuAAsdOxmisWCl.png": {
    webp: { 480: storage("mark-480_07873697.webp"), 768: storage("mark-768_06ec23ba.webp"), 1200: storage("mark-1200_8d519180.webp") },
    avif: { 480: storage("mark-480_3bd8854e.avif"), 768: storage("mark-768_9049b51e.avif"), 1200: storage("mark-1200_afdcf30a.avif") },
  },
};

export function responsiveMediaFor(src: string): ResponsiveMedia | undefined {
  const fileName = src.split("/").pop()?.split("?")[0];
  return fileName ? mediaBySource[fileName] : undefined;
}

export function mediaSrcSet(src: string, format: keyof ResponsiveMedia): string | undefined {
  const media = responsiveMediaFor(src)?.[format];
  return media ? Object.entries(media).map(([width, url]) => `${url} ${width}w`).join(", ") : undefined;
}
