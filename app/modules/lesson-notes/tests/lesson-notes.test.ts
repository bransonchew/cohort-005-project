import { describe, it, expect } from "vitest";
import { describeNoteDraft } from "../index";

describe("describeNoteDraft", () => {
  it("counts characters against the note limit", () => {
    const state = describeNoteDraft("hello", null);
    expect(state.length).toBe(5);
    expect(state.max).toBe(2000);
  });

  it("allows saving a new non-blank note", () => {
    const state = describeNoteDraft("Remember the kind tag", null);
    expect(state).toMatchObject({
      unsaved: true,
      empty: false,
      tooLong: false,
      canSave: true,
    });
  });

  it("does not allow saving a blank draft", () => {
    const state = describeNoteDraft("   \n ", null);
    expect(state.empty).toBe(true);
    expect(state.canSave).toBe(false);
  });

  it("treats an untouched empty editor as saved", () => {
    expect(describeNoteDraft("", null).unsaved).toBe(false);
  });

  it("does not allow saving a draft identical to the saved note", () => {
    const state = describeNoteDraft("same", "same");
    expect(state.unsaved).toBe(false);
    expect(state.canSave).toBe(false);
  });

  it("flags edits to a saved note as unsaved", () => {
    const state = describeNoteDraft("same, edited", "same");
    expect(state.unsaved).toBe(true);
    expect(state.canSave).toBe(true);
  });

  it("allows a draft exactly at the limit", () => {
    const state = describeNoteDraft("a".repeat(2000), null);
    expect(state.tooLong).toBe(false);
    expect(state.canSave).toBe(true);
  });

  it("blocks a draft over the limit", () => {
    const state = describeNoteDraft("a".repeat(2001), null);
    expect(state.tooLong).toBe(true);
    expect(state.canSave).toBe(false);
  });
});
