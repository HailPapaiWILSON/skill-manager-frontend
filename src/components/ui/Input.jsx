// Input.jsx
import React from "react";
import styles from "./Input.module.css";

export const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required,
  error,
  className = "",
}) => {
  return (
    <div className={`${styles.group} ${className}`}>
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`${styles.input} ${error ? styles.error : ""}`}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
