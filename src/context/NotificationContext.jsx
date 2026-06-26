import { createContext, useState, useContext } from "react";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  const value = { notifications, showToast };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastContainer notifications={notifications} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

// Toast component (simple)
const ToastContainer = ({ notifications }) => {
  if (notifications.length === 0) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        maxWidth: "300px",
      }}
    >
      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "0.375rem",
            backgroundColor:
              n.type === "error"
                ? "#ef4444"
                : n.type === "success"
                  ? "#22c55e"
                  : "#3b82f6",
            color: "#fff",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
            animation: "slideIn 0.3s ease",
          }}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
};
