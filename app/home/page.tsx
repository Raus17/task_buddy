"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import LogoutButton from "../components/LogoutButton";
import List from "../components/List";
import Board from "../components/Board";
import { FaListUl } from "react-icons/fa";
import { PiSquaresFourBold } from "react-icons/pi";

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("list");

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div>
      {/* Fixed Header */}
      <Header />

      {/* Main Content Wrapper */}
      <main className="pt-16 px-6">
        {/* Top Row: Tabs on Left, Logout on Right */}
        <div className="flex justify-between items-center border-b pb-2">
          {/* Tab Switcher (Left Aligned) */}
          <div className="flex items-center gap-6">
            <button
              className={`flex items-center gap-2 px-3 py-1 text-lg font-semibold transition-all ${
                activeTab === "list" ? "text-black border-b-2 border-black" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("list")}
            >
              <FaListUl className="text-xl" />
              List
            </button>

            <button
              className={`flex items-center gap-2 px-3 py-1 text-lg font-semibold transition-all ${
                activeTab === "board" ? "text-black border-b-2 border-black" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("board")}
            >
              <PiSquaresFourBold className="text-xl" />
              Board
            </button>
          </div>

          {/* Logout Button (Right Aligned) */}
          <LogoutButton />
        </div>

        {/* Render the Correct Component Based on Active Tab */}
        {activeTab === "list" ? <List /> : <Board />}
      </main>
    </div>
  );
};

export default Page;
