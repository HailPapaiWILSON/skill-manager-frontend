// Table.jsx
import React from "react";
import styles from "./Table.module.css";

export const Table = ({ columns, data, renderRow, className = "" }) => {
  return (
    <table className={`${styles.table} ${className}`}>
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map((item, idx) => renderRow(item, idx))}</tbody>
    </table>
  );
};
