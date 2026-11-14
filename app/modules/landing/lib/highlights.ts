export type LandingStat = { value: number; label: string };

export type LandingHighlights<Course> = {
  spotlight: Course | null;
  featured: Course[];
  stats: LandingStat[];
};

export const FEATURED_COUNT = 3;

function countLabel(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

export function pickHighlights<Course>(
  newestFirst: Course[],
  totalCourses: number,
  totalCategories: number
): LandingHighlights<Course> {
  const [spotlight = null, ...rest] = newestFirst;
  return {
    spotlight,
    featured: rest.slice(0, FEATURED_COUNT),
    stats: [
      {
        value: totalCourses,
        label: countLabel(totalCourses, "course", "courses"),
      },
      {
        value: totalCategories,
        label: countLabel(totalCategories, "category", "categories"),
      },
    ],
  };
}
