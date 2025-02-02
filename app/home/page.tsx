"use client";
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

const Page = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Redirect to login page if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push("/"); // Redirects to login page after logout
    }
  }, [user, router]);

  return (
    <div>
      {/* Fixed Header */}
      <Header />

      {/* Add padding to prevent content overlap */}
      <main className="pt-20 px-6">
        {user ? (
          <>
            <p>Welcome, {user.displayName}</p>
            <button onClick={logout}>Logout</button>
          </>
        ) : null}
      </main>
    </div>
  );
};

export default Page;
