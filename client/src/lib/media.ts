type ResponsiveMedia = {
  webp: Record<number, string>;
  avif: Record<number, string>;
};

const PUBLIC_CDN_ROOT = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663894363217";
const publicSource = (name: string) => `${PUBLIC_CDN_ROOT}/${name}`;
const widths = [480, 768, 1200] as const;
const sameSourceAtWidths = (name: string) => Object.fromEntries(widths.map((width) => [width, publicSource(name)])) as Record<number, string>;

const mediaBySource: Record<string, ResponsiveMedia> = {
  "XgTNBfpPRvrnTFPr.jpg": { webp: sameSourceAtWidths("XgTNBfpPRvrnTFPr.jpg"), avif: sameSourceAtWidths("XgTNBfpPRvrnTFPr.jpg") },
  "lCrSqnLAXFKXmWXd.jpg": { webp: sameSourceAtWidths("lCrSqnLAXFKXmWXd.jpg"), avif: sameSourceAtWidths("lCrSqnLAXFKXmWXd.jpg") },
  "RCOUOqqGlNukXVjv.jpg": { webp: sameSourceAtWidths("RCOUOqqGlNukXVjv.jpg"), avif: sameSourceAtWidths("RCOUOqqGlNukXVjv.jpg") },
  "lJJsOdgSMDOjJmdQ.jpg": { webp: sameSourceAtWidths("lJJsOdgSMDOjJmdQ.jpg"), avif: sameSourceAtWidths("lJJsOdgSMDOjJmdQ.jpg") },
  "FcXuAAsdOxmisWCl.png": { webp: sameSourceAtWidths("FcXuAAsdOxmisWCl.png"), avif: sameSourceAtWidths("FcXuAAsdOxmisWCl.png") },
};

export function responsiveMediaFor(src: string): ResponsiveMedia | undefined {
  const fileName = src.split("/").pop()?.split("?")[0];
  return fileName ? mediaBySource[fileName] : undefined;
}

export function mediaSrcSet(src: string, format: keyof ResponsiveMedia): string | undefined {
  const media = responsiveMediaFor(src)?.[format];
  return media ? Object.entries(media).map(([width, url]) => `${url} ${width}w`).join(", ") : undefined;
}
