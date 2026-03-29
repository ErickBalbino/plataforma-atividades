import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ActivitiesPage } from "./pages/activities/ActivitiesPage";
import { ActivityDetailsPage } from "./pages/activities/ActivityDetailsPage";
import { CreateActivityPage } from "./pages/activities/CreateActivityPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { GradingPage } from "./pages/submissions/GradingPage";
import { MySubmissionsPage } from "./pages/submissions/MySubmissionsPage";
import { ProtectedRoute } from "./shared/components/auth/ProtectedRoute";
import { RoleRoute } from "./shared/components/auth/RoleRoute";
import { MainLayout } from "./shared/components/layout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/atividades" replace />} />
          <Route path="atividades" element={<ActivitiesPage />} />
          <Route path="atividades/:id" element={<ActivityDetailsPage />} />
          <Route
            path="nova-atividade"
            element={
              <RoleRoute allowedRoles={["TEACHER"]}>
                <CreateActivityPage />
              </RoleRoute>
            }
          />
          <Route
            path="correcoes"
            element={
              <RoleRoute allowedRoles={["TEACHER"]}>
                <GradingPage />
              </RoleRoute>
            }
          />
          <Route
            path="minhas-respostas"
            element={
              <RoleRoute allowedRoles={["STUDENT"]}>
                <MySubmissionsPage />
              </RoleRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
