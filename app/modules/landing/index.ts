import {
  FEATURED_COUNT,
  pickHighlights,
  type LandingHighlights,
  type LandingStat,
} from "./lib/highlights";

export type { LandingHighlights, LandingStat };

/** How many of the newest courses the landing page shows: the spotlight plus the featured row. */
export const LANDING_COURSE_COUNT = FEATURED_COUNT + 1;

/**
 * Splits the newest published courses into the hero's spotlight and the
 * featured row beneath it, and words the catalogue counts for the hero.
 */
export function landingHighlights<Course>(input: {
  newestFirst: Course[];
  totalCourses: number;
  totalCategories: number;
}): LandingHighlights<Course> {
  return pickHighlights(
    input.newestFirst,
    input.totalCourses,
    input.totalCategories
  );
}
