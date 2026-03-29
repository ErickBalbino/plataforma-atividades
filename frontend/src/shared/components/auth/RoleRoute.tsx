import { Spin } from "antd";
import { Navigate } from "react-router-dom";
import { useUser } from "../../../features/auth/hooks/useAuth";
import { AuthUser } from "../../../features/auth/types";

interface RoleRouteProps {
  children: JSX.Element;
  allowedRoles: Array<AuthUser["role"]>;
}

export const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/atividades" replace />;
  }

  return children;
};
