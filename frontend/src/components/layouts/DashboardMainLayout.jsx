import React from "react";
import DashboardNavbar from "../DashboardNavbar";
import DashboardSidebar from "../DashboardSidebar";

function DashboardMainLayout({ children }) {
  return (
    <div className="antialiased bg-gray-50 dark:bg-gray-900">
      {/* Dashboar navbar */}
      <DashboardNavbar />
      {/* Dashboard sidebar */}
      <DashboardSidebar />
      <main className="p-4 md:ml-64 h-auto pt-20">{children}</main>
    </div>
  );
}

export default DashboardMainLayout;
