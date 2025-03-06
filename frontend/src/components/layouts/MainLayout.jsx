import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import Navbar from "../Navbar";

function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;
