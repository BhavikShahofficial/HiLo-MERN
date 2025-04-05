import { Navigate, useLocation } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  console.log(
    "Current Path:",
    location.pathname,
    "| Authenticated:",
    isAuthenticated
  );

  // Show loader while auth status is being determined
  if (isAuthenticated === null) {
    return <Skeleton className="w-[600px] h-[600px] bg-black mx-auto" />;
  }

  // Redirect to appropriate dashboard if accessing `/`
  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    }
    return (
      <Navigate
        to={user?.role === "admin" ? "/admin/dashboard" : "/shop/home"}
      />
    );
  }

  const authRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];

  const isResetPasswordRoute = location.pathname.startsWith(
    "/auth/reset-password"
  );

  // Restrict access to protected pages when not authenticated
  if (
    !isAuthenticated &&
    !authRoutes.includes(location.pathname) &&
    !isResetPasswordRoute
  ) {
    return <Navigate to="/auth/login" />;
  }

  // Prevent authenticated users from accessing login/register/forgot/reset-password pages
  if (
    isAuthenticated &&
    (authRoutes.includes(location.pathname) || isResetPasswordRoute)
  ) {
    return (
      <Navigate
        to={user?.role === "admin" ? "/admin/dashboard" : "/shop/home"}
      />
    );
  }

  // Prevent non-admins from accessing admin routes
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.startsWith("/admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  // Prevent admins from accessing shopper routes
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.startsWith("/shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
