import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout/AppLayout";
import "./App.css";

// Route-based code splitting via React.lazy() (per PRD Architecture §3)
const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const MembersPage = lazy(() => import("./pages/MembersPage/MembersPage"));
const AddMemberPage = lazy(() => import("./pages/AddMemberPage/AddMemberPage"));
const TasksPage = lazy(() => import("./pages/TasksPage/TasksPage"));
const AssignTaskPage = lazy(
  () => import("./pages/AssignTaskPage/AssignTaskPage"),
);
const AllocationPage = lazy(
  () => import("./pages/AllocationPage/AllocationPage"),
);

function PageLoader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "50vh",
        gap: "0.75rem",
        color: "var(--text-secondary)",
        fontFamily: "var(--font-display)",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "3px solid var(--border-subtle)",
          borderTopColor: "var(--accent-primary)",
          animation: "spin 0.8s linear infinite",
        }}
      />
      Loading…
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/add-member" element={<AddMemberPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/assign-task" element={<AssignTaskPage />} />
            <Route path="/allocation" element={<AllocationPage />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
