import React from "react";
import Sidebar from "./_components/sidebar";
import { Navbar } from "./_components/navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="fixed inset-y-0 z-50 flex-col hidden w-56 h-full md:flex">
        <Sidebar />
      </div>
      <main className="h-full md:pl-56">{children}</main>
    </div>
  );
};

export default DashboardLayout;
