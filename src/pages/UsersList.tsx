// pages/UsersList.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { User } from "../types";
import { Skeleton } from "../components/ui/skeleton";
import { Search, Users, Mail, Building2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function UsersList() {
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/usuarios");
      return response.data as User[];
    },
  });

  const filteredUsers = users?.filter(
    (user) =>
      (user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.equipe?.nome?.toLowerCase().includes(searchTerm.toLowerCase())) ??
      false,
  );

  if (isLoading) {
    return <UsersListSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Users</h1>
          <p className="text-muted-foreground">
            Browse all members across the organization
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users by name, email, or team..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Users Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers?.map((user) => {
          const isCurrentUser = currentUser?.id === user.id;
          return (
            <Link
              key={user.id}
              to={`/users/${user.id}`}
              className="group block p-4 bg-card border rounded-lg hover:shadow-md transition-all hover:border-primary/50"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                  {user.nome.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold group-hover:text-primary transition-colors truncate">
                      {user.nome}
                    </h3>
                    {isCurrentUser && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full whitespace-nowrap">
                        You
                      </span>
                    )}
                    {user.funcao === "administrador" && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                        Admin
                      </span>
                    )}
                  </div>

                  <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1 truncate">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.equipe && (
                      <div className="flex items-center gap-1 truncate">
                        <Building2 className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{user.equipe.nome}</span>
                      </div>
                    )}
                  </div>

                  {user.skills && user.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {user.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill.skillId}
                          className="px-1.5 py-0.5 text-xs bg-muted rounded"
                        >
                          {skill.skill?.nome}
                        </span>
                      ))}
                      {user.skills.length > 3 && (
                        <span className="px-1.5 py-0.5 text-xs text-muted-foreground">
                          +{user.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredUsers?.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No users found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}

function UsersListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 max-w-md" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-4 border rounded-lg flex items-start gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
              <div className="flex gap-1">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
