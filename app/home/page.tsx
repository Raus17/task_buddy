"use client";
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import LogoutButton from "../components/LogoutButton";

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
            <main className="pt-16 px-6">
                <LogoutButton />
            </main>
        </div>
    );
};

export default Page;
