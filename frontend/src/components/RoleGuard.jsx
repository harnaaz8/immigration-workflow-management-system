import { Navigate, useLocation } from "react-router-dom";

function RoleGuard({ allowedRoles = [], children }) {
  const currentRole = localStorage.getItem("role");
  // ✅ FIX: Verify auth by checking if a role exists (since backend tracks the token inside httpOnly cookies)
  const isAuthenticated = !!currentRole; 
  const location = useLocation();

  // CASE 1: Session unauthenticated - redirect securely to login gate
  if (!isAuthenticated) {
    console.warn("Unauthorized access intercept: Session role missing.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Normalize role formats (e.g., handles both 'SUPERADMIN' and 'SUPER_ADMIN')
  const normalizedRole = currentRole.toUpperCase().replace("_", "");
  const normalizedAllowedRoles = allowedRoles.map(r => r.toUpperCase().replace("_", ""));

  // CASE 2: Session exists, but role metadata fails verification matrix
  if (!normalizedAllowedRoles.includes(normalizedRole)) {
    console.error(
      `Access Denied: Role "${currentRole}" lacks clearance for target route.`
    );
    return <Navigate to="/dashboard" replace />;
  }

  // CASE 3: Clearance verified successfully
  return children;
}

export default RoleGuard;