import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { CourseImage } from "~/components/course-image";
import { CourseMeta } from "./course-meta";
import type { LandingCourse } from "~/modules/landing";

export function SpotlightCard({ course }: { course: LandingCourse }) {
  return (
    <div className="relative isolate">
      <div
        aria-hidden
        className="absolute -inset-4 -z-10 rotate-2 rounded-3xl bg-primary/10"
      />
      <Link
        to={`/courses/${course.slug}`}
        className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-shadow hover:shadow-xl"
      >
        <CourseImage
          src={course.coverImageUrl}
          alt={course.title}
          className="aspect-video w-full object-cover"
        />
        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Newest course
          </p>
          <h2 className="mt-2 text-xl font-semibold leading-snug group-hover:text-primary">
            {course.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {course.description}
          </p>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <CourseMeta course={course} />
            </div>
            <span className="hidden items-center gap-1 font-medium text-foreground sm:flex">
              Start learning
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
