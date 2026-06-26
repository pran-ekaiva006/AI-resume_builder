import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Header from "./components/custom/Header";
import { Toaster } from "./components/ui/sonner";
import { LoaderCircle } from "lucide-react";

function App() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
    </div>
  );

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
