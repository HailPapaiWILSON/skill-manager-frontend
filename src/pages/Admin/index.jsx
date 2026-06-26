// Admin/index.jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./index.module.css";

const AdminLayout = () => {
  return (
    <div>
      <h1>Painel Administrativo</h1>
      <nav className={styles.subNav}>
        <NavLink
          to="/admin/teams"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Equipes
        </NavLink>
        <NavLink
          to="/admin/projects"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Projetos
        </NavLink>
        <NavLink
          to="/admin/skills"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Skills
        </NavLink>
        <NavLink
          to="/admin/categories"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Categorias
        </NavLink>
      </nav>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
