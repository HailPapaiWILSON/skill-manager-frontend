// Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useAuth } from "../../hooks/useAuth";

export const Sidebar = () => {
  const { isAdmin, logout } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>Skill Manager</div>
      <nav className={styles.nav}>
        <NavLink
          to="/teams"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Equipes
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Projetos
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Perfil
        </NavLink>
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Admin
          </NavLink>
        )}
        <button onClick={logout} className={styles.logout}>
          Sair
        </button>
      </nav>
    </aside>
  );
};
