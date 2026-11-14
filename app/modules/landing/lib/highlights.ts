import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { count, desc, eq, inArray } from "drizzle-orm";
import * as schema from "~/db/schema";
import { categories, courses, lessons, modules, users } from "~/db/schema";

export type Db = BetterSQLite3Database<typeof schema>;

export type LandingStat = { value: number; label: string };

export type LandingCourse = {
  id: number;
  slug: string;
  title: string;
  description: string;
  coverImageUrl: string | null;
  instructorName: string;
  lessonCount: number;
};

export type LandingHighlights = {
  spotlight: LandingCourse | null;
  featured: LandingCourse[];
  stats: LandingStat[];
};

const FEATURED_COUNT = 3;

function countLabel(value: number, singular: string, plural: string) {
  return value === 1 ? singular : plural;
}

function newestPublished(db: Db) {
  return db
    .select({
      id: courses.id,
      slug: courses.slug,
      title: courses.title,
      description: courses.description,
      coverImageUrl: courses.coverImageUrl,
      instructorName: users.name,
    })
    .from(courses)
    .innerJoin(users, eq(courses.instructorId, users.id))
    .where(eq(courses.status, schema.CourseStatus.Published))
    .orderBy(desc(courses.createdAt), desc(courses.id))
    .limit(FEATURED_COUNT + 1)
    .all();
}

function lessonCounts(db: Db, courseIds: number[]) {
  const rows = db
    .select({ courseId: modules.courseId, lessonCount: count(lessons.id) })
    .from(lessons)
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .where(inArray(modules.courseId, courseIds))
    .groupBy(modules.courseId)
    .all();
  return new Map(rows.map((row) => [row.courseId, row.lessonCount]));
}

function catalogueStats(db: Db): LandingStat[] {
  const [{ value: totalCourses }] = db
    .select({ value: count() })
    .from(courses)
    .where(eq(courses.status, schema.CourseStatus.Published))
    .all();
  const [{ value: totalCategories }] = db
    .select({ value: count() })
    .from(categories)
    .all();
  return [
    {
      value: totalCourses,
      label: countLabel(totalCourses, "course", "courses"),
    },
    {
      value: totalCategories,
      label: countLabel(totalCategories, "category", "categories"),
    },
  ];
}

export function getLandingHighlights(db: Db): LandingHighlights {
  const newest = newestPublished(db);
  const counts = lessonCounts(
    db,
    newest.map((course) => course.id)
  );
  const [spotlight = null, ...featured] = newest.map((course) => ({
    ...course,
    lessonCount: counts.get(course.id) ?? 0,
  }));
  return { spotlight, featured, stats: catalogueStats(db) };
}
