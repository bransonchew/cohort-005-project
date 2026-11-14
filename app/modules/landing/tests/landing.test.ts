import { describe, it, expect, beforeEach } from "vitest";
import { createTestDb, seedBaseData, type TestDb } from "~/test/setup";
import * as schema from "~/db/schema";
import { CourseStatus } from "~/db/schema";
import { markdown } from "~/lib/text";
import { createLanding } from "../index.server";

let db: TestDb;
let instructorId: number;
let categoryId: number;

beforeEach(() => {
  db = createTestDb();
  const base = seedBaseData(db);
  instructorId = base.instructor.id;
  categoryId = base.category.id;
  // The seeded course would otherwise compete for "newest"; retire it.
  db.update(schema.courses).set({ status: CourseStatus.Draft }).run();
});

// ─── Fixtures ───
// Nothing writes courses, modules or lessons from a service, so rows go in
// directly. Kept in one place so a schema change touches only this block.

function addCourse(
  title: string,
  createdAt: string,
  status = CourseStatus.Published
) {
  return db
    .insert(schema.courses)
    .values({
      title,
      slug: title.toLowerCase().replaceAll(" ", "-"),
      description: `About ${title}`,
      salesCopy: markdown(`## ${title}`),
      instructorId,
      categoryId,
      status,
      createdAt,
    })
    .returning()
    .get();
}

function addLessons(courseId: number, perModule: number[]) {
  perModule.forEach((lessonCount, position) => {
    const mod = db
      .insert(schema.modules)
      .values({ courseId, title: `Module ${position}`, position })
      .returning()
      .get();
    for (let i = 0; i < lessonCount; i++) {
      db.insert(schema.lessons)
        .values({ moduleId: mod.id, title: `Lesson ${i}`, position: i })
        .run();
    }
  });
}

function day(n: number) {
  return `2026-01-${String(n).padStart(2, "0")}T00:00:00.000Z`;
}

const highlights = () => createLanding(db).highlights();
const titles = (courses: { title: string }[]) => courses.map((c) => c.title);

describe("landing highlights", () => {
  it("puts the newest published course in the spotlight and the next three in the featured row", () => {
    for (const n of [3, 5, 1, 4, 2]) addCourse(`Course ${n}`, day(n));

    const result = highlights();

    expect(result.spotlight?.title).toBe("Course 5");
    expect(titles(result.featured)).toEqual([
      "Course 4",
      "Course 3",
      "Course 2",
    ]);
  });

  it("leaves out courses that are not published", () => {
    addCourse("Live", day(1));
    addCourse("Draft", day(2), CourseStatus.Draft);
    addCourse("Archived", day(3), CourseStatus.Archived);

    const result = highlights();

    expect(result.spotlight?.title).toBe("Live");
    expect(result.featured).toEqual([]);
  });

  it("has no spotlight when nothing is published", () => {
    const result = highlights();

    expect(result.spotlight).toBeNull();
    expect(result.featured).toEqual([]);
  });

  it("carries what a course card shows, with lessons counted across modules", () => {
    const course = addCourse("Counted", day(2));
    addLessons(course.id, [2, 3]);
    addLessons(addCourse("Empty", day(1)).id, []);

    const { spotlight, featured } = highlights();

    expect(spotlight).toEqual({
      id: course.id,
      slug: "counted",
      title: "Counted",
      description: "About Counted",
      coverImageUrl: null,
      instructorName: "Test Instructor",
      lessonCount: 5,
    });
    expect(featured[0].lessonCount).toBe(0);
  });

  it("counts every published course, not just the ones it shows", () => {
    for (let n = 1; n <= 6; n++) addCourse(`Course ${n}`, day(n));
    addCourse("Draft", day(9), CourseStatus.Draft);
    db.insert(schema.categories)
      .values({ name: "Design", slug: "design" })
      .run();

    expect(highlights().stats).toEqual([
      { value: 6, label: "courses" },
      { value: 2, label: "categories" },
    ]);
  });

  it("uses the singular for a count of one", () => {
    addCourse("Only", day(1));

    expect(highlights().stats).toEqual([
      { value: 1, label: "course" },
      { value: 1, label: "category" },
    ]);
  });

  it("pluralises a count of zero", () => {
    db.delete(schema.courses).run();
    db.delete(schema.categories).run();

    expect(highlights().stats).toEqual([
      { value: 0, label: "courses" },
      { value: 0, label: "categories" },
    ]);
  });
});
