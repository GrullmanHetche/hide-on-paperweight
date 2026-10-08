// Coordinate the two peripheral objects for both pointer and keyboard users.
export const deskObjectOpenEvent = "paperweight:desk-object-open";
export type DeskObject = "paperweight" | "playlist";
export function announceDeskObject(object: DeskObject) {
  window.dispatchEvent(new CustomEvent<DeskObject>(deskObjectOpenEvent, { detail: object }));
}
export function openedDeskObject(event: Event): DeskObject {
  return (event as CustomEvent<DeskObject>).detail;
}
