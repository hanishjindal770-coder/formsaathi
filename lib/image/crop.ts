/** Crop-box geometry in source-image pixels. Pure functions, used by the cropper UI. */

export type Rect = { x: number; y: number; width: number; height: number };

/** Largest centred rect of the given aspect (w/h) that fits the image; whole image if aspect is null. */
export function initialCrop(imgW: number, imgH: number, aspect: number | null, fill = 0.9): Rect {
  if (aspect === null) return { x: 0, y: 0, width: imgW, height: imgH };
  let width = imgW * fill;
  let height = width / aspect;
  if (height > imgH * fill) {
    height = imgH * fill;
    width = height * aspect;
  }
  return { x: (imgW - width) / 2, y: (imgH - height) / 2, width, height };
}

/** Keeps the rect inside the image, shrinking it (keeping the aspect when given) if needed. */
export function clampCrop(r: Rect, imgW: number, imgH: number, aspect: number | null, minSize = 16): Rect {
  let { width, height } = r;
  if (aspect !== null) {
    width = Math.max(minSize, Math.min(width, imgW, imgH * aspect));
    height = width / aspect;
  } else {
    width = Math.max(minSize, Math.min(width, imgW));
    height = Math.max(minSize, Math.min(height, imgH));
  }
  const x = Math.min(Math.max(0, r.x), imgW - width);
  const y = Math.min(Math.max(0, r.y), imgH - height);
  return { x, y, width, height };
}

export function moveCrop(r: Rect, dx: number, dy: number, imgW: number, imgH: number): Rect {
  return clampCrop({ ...r, x: r.x + dx, y: r.y + dy }, imgW, imgH, null);
}

/** Resizes from the bottom-right corner; with an aspect, the larger of the two deltas wins. */
export function resizeCrop(r: Rect, dx: number, dy: number, imgW: number, imgH: number, aspect: number | null): Rect {
  if (aspect === null) {
    return clampCrop({ ...r, width: Math.min(r.width + dx, imgW - r.x), height: Math.min(r.height + dy, imgH - r.y) }, imgW, imgH, null);
  }
  const d = Math.abs(dx) > Math.abs(dy * aspect) ? dx : dy * aspect;
  const maxW = Math.min(imgW - r.x, (imgH - r.y) * aspect);
  const width = Math.min(Math.max(16, r.width + d), maxW);
  return { ...r, width, height: width / aspect };
}

/** Scales the rect around its centre (zoom slider). */
export function scaleCrop(r: Rect, factor: number, imgW: number, imgH: number, aspect: number | null): Rect {
  const cx = r.x + r.width / 2;
  const cy = r.y + r.height / 2;
  const width = r.width * factor;
  const height = aspect === null ? r.height * factor : width / aspect;
  return clampCrop({ x: cx - width / 2, y: cy - height / 2, width, height }, imgW, imgH, aspect);
}

/** Grows `r` around its centre until it has the given aspect, then fits it inside the image. */
export function expandToAspect(r: Rect, aspect: number | null, imgW: number, imgH: number): Rect {
  if (aspect === null) return clampCrop(r, imgW, imgH, null);
  let width = r.width;
  let height = r.height;
  if (width / height < aspect) width = height * aspect;
  else height = width / aspect;
  const cx = r.x + r.width / 2;
  const cy = r.y + r.height / 2;
  return clampCrop({ x: cx - width / 2, y: cy - height / 2, width, height }, imgW, imgH, aspect);
}
