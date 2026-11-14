import { useState } from "react";
import { useFetcher } from "react-router";
import { describeNoteDraft, type NoteDraftState } from "~/modules/lesson-notes";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { NotebookPen } from "lucide-react";
import { cn, formatRelativeTime } from "~/lib/utils";
import type { LessonLoaderData } from "~/components/lesson/types";

type SavedNote = LessonLoaderData["note"];

// Same card, heading and footer layout as the Questions & Discussion card, so
// the two read as one family on the lesson page.
export function LessonNote({ note }: { note: SavedNote }) {
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();
  const [draft, setDraft] = useState(note?.body ?? "");
  const isSaving = fetcher.state !== "idle";
  const state = describeNoteDraft(draft, note?.body ?? null);

  return (
    <Card className="mb-8">
      <CardContent className="px-6">
        <NoteHeading />
        <fetcher.Form method="post" className="space-y-2">
          <input type="hidden" name="intent" value="save-note" />
          <Textarea
            name="body"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Only you can read this."
            aria-label="Your notes"
            className="min-h-32 resize-y"
          />
          <NoteFooter
            note={note}
            state={state}
            isSaving={isSaving}
            error={fetcher.data?.error}
          />
        </fetcher.Form>
      </CardContent>
    </Card>
  );
}

function NoteHeading() {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <NotebookPen className="size-5 text-primary" />
        <h2 className="text-xl font-semibold">Your notes</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Private to you. Jot down what you want to remember from this lesson.
      </p>
    </div>
  );
}

function NoteFooter({
  note,
  state,
  isSaving,
  error,
}: {
  note: SavedNote;
  state: NoteDraftState;
  isSaving: boolean;
  error: string | undefined;
}) {
  return (
    <div className="flex items-center gap-3">
      <Button type="submit" size="sm" disabled={isSaving || !state.canSave}>
        {isSaving ? "Saving..." : "Save note"}
      </Button>
      <NoteStatus note={note} unsaved={state.unsaved} error={error} />
      <span
        className={cn(
          "ml-auto text-xs",
          state.tooLong ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {state.length} / {state.max}
      </span>
    </div>
  );
}

function NoteStatus({
  note,
  unsaved,
  error,
}: {
  note: SavedNote;
  unsaved: boolean;
  error: string | undefined;
}) {
  if (error) return <span className="text-sm text-destructive">{error}</span>;
  if (unsaved) {
    return (
      <span className="text-xs text-muted-foreground">Unsaved changes</span>
    );
  }
  if (!note) return null;
  return (
    <span suppressHydrationWarning className="text-xs text-muted-foreground">
      Saved · last edited {formatRelativeTime(note.updatedAt)}
    </span>
  );
}
