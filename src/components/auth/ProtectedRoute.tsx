import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { axiosInstance } from "../../axios";
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
        const res = await axiosInstance.get("auth/me");
        const data = res.data as { roleLevel: string };


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
