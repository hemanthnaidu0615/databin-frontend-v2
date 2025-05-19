import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  element: React.ReactElement;
  allowedRoles?: string[]; // e.g. ['admin', 'manager']
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, allowedRoles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();
        const userRoleLevel = data.roleLevel;

        if (!allowedRoles || allowedRoles.length === 0) {
          setIsAuthorized(true);
        } else {
          const isAllowed = allowedRoles.includes(userRoleLevel);
          setIsAuthorized(isAllowed);
        }
      } catch (err) {
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, [allowedRoles]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthorized) return <Navigate to="/signin" replace />;

  return element;
};

export default ProtectedRoute;
