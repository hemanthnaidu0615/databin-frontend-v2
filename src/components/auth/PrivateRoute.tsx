import { Navigate, Outlet } from "react-router-dom";

type User = {
  id: number;
  role_id: number | null;
  role: string;
  token: string;
};

type ProtectedRouteProps = {
  user: User | null;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user }) => {
  console.log("ProtectedRoute received user:", user);

  if (!user) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
