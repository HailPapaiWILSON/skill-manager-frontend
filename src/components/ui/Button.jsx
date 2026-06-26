// Button.jsx
import React from "react";
import styles from "./Button.module.css";

export const Button = ({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled,
  className = "",
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
