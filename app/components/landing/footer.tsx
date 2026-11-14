import { Link } from "react-router";
import type { LandingUser } from "./types";

const linkClass =
  "text-muted-foreground transition-colors hover:text-foreground";

export function LandingFooter({ currentUser }: { currentUser: LandingUser }) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold tracking-tight">Cadence</p>
          <p className="mt-1 text-muted-foreground">
            Courses for developers, at your own pace.
          </p>
        </div>
        <nav className="flex items-center gap-6">
          <Link to="/courses" className={linkClass}>
            Courses
          </Link>
          {currentUser ? (
            <Link to="/dashboard" className={linkClass}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className={linkClass}>
                Log In
              </Link>
              <Link to="/signup" className={linkClass}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </footer>
  );
}
