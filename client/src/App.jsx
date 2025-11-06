import { Navigate, Outlet } from "react-router-dom";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import Header from "./components/custom/Header";
import { Toaster } from "./components/ui/sonner";

function App() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null; // wait until Clerk is ready

  return (
    <>
      {/* ✅ Only show Dashboard + content when user is signed in */}
      <SignedIn>
        <Header />
        <Outlet />
        <Toaster />
      </SignedIn>

      
      <SignedOut>
        <Navigate to="/auth/sign-in" />
      </SignedOut>
    </>
  );
}

export default App;
