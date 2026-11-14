export type LandingCourse = {
  id: number;
  slug: string;
  title: string;
  description: string;
  coverImageUrl: string | null;
  instructorName: string | null;
  lessonCount: number;
};

export type LandingUser = { id: number; name: string; role: string } | null;
