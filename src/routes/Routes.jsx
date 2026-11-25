import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import React, { Suspense } from "react";
import ProtectedRoute from "./ProtectedRoute";
const Unauthorized = React.lazy(() => import("../pages/Unauthorized"));
import Loader from "../components/common/Loader";
import { routeConfig } from "./routeConfig";

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {routeConfig.map(({ path, module, action, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute module={module} action={action}>
                {element}
              </ProtectedRoute>
            }
          />
        ))}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
