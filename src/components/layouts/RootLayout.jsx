// RootLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../ui/Sidebar";
import styles from "./RootLayout.module.css";

const RootLayout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
