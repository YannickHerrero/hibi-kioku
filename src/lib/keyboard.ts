import { useEffect } from "react";

type Handler = (event: KeyboardEvent) => void;

// Subscribes to window keydown for the listed keys and invokes the
// handler with the matching event. Ignores events while the user is
// typing in an editable element so shortcuts don't fight forms.
export function useKeyboardShortcut(keys: string[], handler: Handler) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (!keys.includes(event.key)) return;
      handler(event);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [keys, handler]);
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}
