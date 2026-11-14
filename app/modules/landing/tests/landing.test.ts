import { describe, it, expect } from "vitest";
import { landingHighlights, LANDING_COURSE_COUNT } from "../index";

const course = (id: number) => ({ id, title: `Course ${id}` });

describe("landingHighlights", () => {
  it("puts the newest course in the spotlight and the next three in the featured row", () => {
    const result = landingHighlights({
      newestFirst: [1, 2, 3, 4, 5].map(course),
      totalCourses: 5,
      totalCategories: 2,
    });

    expect(result.spotlight).toEqual(course(1));
    expect(result.featured).toEqual([2, 3, 4].map(course));
  });

  it("asks for exactly as many courses as it can show", () => {
    expect(LANDING_COURSE_COUNT).toBe(4);
  });

  it("leaves the featured row empty when only one course is published", () => {
    const result = landingHighlights({
      newestFirst: [course(7)],
      totalCourses: 1,
      totalCategories: 1,
    });

    expect(result.spotlight).toEqual(course(7));
    expect(result.featured).toEqual([]);
  });

  it("has no spotlight when nothing is published", () => {
    const result = landingHighlights({
      newestFirst: [],
      totalCourses: 0,
      totalCategories: 0,
    });

    expect(result.spotlight).toBeNull();
    expect(result.featured).toEqual([]);
  });

  it("pluralises the catalogue counts", () => {
    const { stats } = landingHighlights({
      newestFirst: [],
      totalCourses: 4,
      totalCategories: 0,
    });

    expect(stats).toEqual([
      { value: 4, label: "courses" },
      { value: 0, label: "categories" },
    ]);
  });

  it("uses the singular for a count of one", () => {
    const { stats } = landingHighlights({
      newestFirst: [],
      totalCourses: 1,
      totalCategories: 1,
    });

    expect(stats).toEqual([
      { value: 1, label: "course" },
      { value: 1, label: "category" },
    ]);
  });
});
