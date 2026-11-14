import { MAX_NOTE_LENGTH } from "~/lib/notes";

export type NoteDraftState = {
  length: number;
  max: number;
  tooLong: boolean;
  empty: boolean;
  /** The draft differs from what is saved, so leaving loses work. */
  unsaved: boolean;
  canSave: boolean;
};

export function noteDraftState(
  draft: string,
  savedBody: string | null
): NoteDraftState {
  const length = draft.length;
  const tooLong = length > MAX_NOTE_LENGTH;
  const empty = draft.trim().length === 0;
  const unsaved = draft !== (savedBody ?? "");

  return {
    length,
    max: MAX_NOTE_LENGTH,
    tooLong,
    empty,
    unsaved,
    // The server rejects a blank note, so a blank draft has nothing to save.
    canSave: unsaved && !empty && !tooLong,
  };
}
