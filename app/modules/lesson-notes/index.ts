import { noteDraftState, type NoteDraftState } from "./lib/draft";

export type { NoteDraftState };

/**
 * What the lesson note editor shows under the text box: the character count,
 * whether the draft has unsaved changes, and whether Save is allowed.
 */
export function describeNoteDraft(
  draft: string,
  savedBody: string | null
): NoteDraftState {
  return noteDraftState(draft, savedBody);
}
