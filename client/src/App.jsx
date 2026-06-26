import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Header from "./components/custom/Header";
import { Toaster } from "./components/ui/sonner";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // wait until Auth is ready

  return (
    <>
      {/* ✅ Only show Dashboard + content when user is signed in */}
      {user ? (
        <>
          <Header />
          <Outlet />
          <Toaster />
        </>
      ) : (
        <Navigate to="/auth/sign-in" />
      )}
    </>
  );
}

export default App;
