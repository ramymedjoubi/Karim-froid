// components/AuthRedirect.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { JSX } from "react";

const AuthRedirect = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={user.isAdmin ? "/admin" : "/"} replace />;
  }

  return children;
};

export default AuthRedirect;
