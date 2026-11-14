import { db } from "~/db";
import { getLandingHighlights, type Db } from "./lib/highlights";

/**
 * The landing page's courses and catalogue counts, bound to a database. The
 * app uses `landing`; tests build their own against a test database.
 */
export function createLanding(database: Db) {
  return {
    /**
     * The newest published course for the hero's spotlight, the next three
     * for the featured row, and the published-course and category counts.
     */
    highlights() {
      return getLandingHighlights(database);
    },
  };
}

// Pure so a route importing this only for its loader doesn't pull the
// database into the client bundle (see `~/db`).
export const landing = /* @__PURE__ */ createLanding(db);
