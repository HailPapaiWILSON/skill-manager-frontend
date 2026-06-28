import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../ui/Sidebar";
import RequireAuth from "../protected/RequireAuth";
import styles from "./RootLayout.module.css";

const RootLayout = () => {
  return (
    <RequireAuth>
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </RequireAuth>
  );
};

export default RootLayout;
