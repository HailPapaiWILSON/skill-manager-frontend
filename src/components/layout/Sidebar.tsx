import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  FolderKanban,
  BarChart3,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function Sidebar() {
  const { user, logout, isAdmin } = useAuth();

  if (!user) return null;

  const navItems = [
    { to: `/teams/${user.equipeId}`, icon: Home, label: "My Team" },
    { to: "/teams", icon: Users, label: "All Teams" },
    { to: "/projects", icon: FolderKanban, label: "Projects" },
    { to: "/users", icon: Users, label: "Users" },
    { to: "/profile", icon: User, label: "My Profile" },
  ];

  if (isAdmin) {
    navItems.push({ to: "/admin", icon: Settings, label: "Admin" });
  }

  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Skill Manager</h1>
        <p className="text-sm text-muted-foreground truncate">
          {user.nome} ({user.funcao})
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
