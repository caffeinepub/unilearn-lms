import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useTheme } from "./hooks/useTheme";
import AdminDashboard from "./pages/AdminDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudentDashboard from "./pages/StudentDashboard";

// Initialize theme on load
function ThemeInitializer() {
  const { theme } = useTheme();
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);
  return null;
}

// Root loading component
function RootLayout() {
  return (
    <>
      <ThemeInitializer />
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  );
}

// Auth guard component
function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { identity, isInitializing } = useInternetIdentity();
  const { isFetching } = useActor();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  if (isInitializing || isFetching) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  return <>{children}</>;
}

// Route definitions
const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
});

const studentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/student",
  component: () => (
    <AuthGuard>
      <StudentDashboard />
    </AuthGuard>
  ),
});

const facultyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faculty",
  component: () => (
    <AuthGuard>
      <FacultyDashboard />
    </AuthGuard>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <AuthGuard>
      <AdminDashboard />
    </AuthGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  studentRoute,
  facultyRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
