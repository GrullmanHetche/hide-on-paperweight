// Normalized coordinates keep the complete object and its note on the paper,
// even when the viewport is resized after dragging.
export function constrainObjectPosition(x: number, y: number, width: number, height: number) {
  const availableWidth = Math.max(1, width);
  const availableHeight = Math.max(1, height);
  return {
    x: Math.max(0, Math.min(availableWidth, x)) / availableWidth,
    y: Math.max(0, Math.min(availableHeight, y)) / availableHeight,
  };
}
