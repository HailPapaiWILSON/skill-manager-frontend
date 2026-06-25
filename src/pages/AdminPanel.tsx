// pages/AdminPanel.tsx
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../api/client";
import { useAuth } from "../hooks/useAuth";
import type { Team, Project, Skill, Category } from "../types";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Building2,
  FolderKanban,
  Code2,
  Tag,
} from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";

// Admin Tabs
const TABS = [
  { id: "teams", label: "Teams", icon: Building2 },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "categories", label: "Categories", icon: Tag },
] as const;

type TabId = (typeof TABS)[number]["id"];

// Schemas
const teamSchema = z.object({
  nome: z.string().min(1, "Name is required"),
  descricao: z.string().optional(),
});

const projectSchema = z.object({
  nome: z.string().min(1, "Name is required"),
  descricao: z.string().optional(),
  status: z.enum(["planejado", "em_andamento", "concluido", "cancelado"]),
  equipeId: z.number().min(1, "Team is required"),
});

const skillSchema = z.object({
  nome: z.string().min(1, "Name is required"),
  categoriaId: z.number().min(1, "Category is required"),
});

const categorySchema = z.object({
  nome: z.string().min(1, "Name is required"),
});

export function AdminPanel() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("teams");
  const [editingId, setEditingId] = useState<number | null>(null);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage teams, projects, skills, and categories
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="pt-4">
        {activeTab === "teams" && (
          <AdminTeams editingId={editingId} setEditingId={setEditingId} />
        )}
        {activeTab === "projects" && (
          <AdminProjects editingId={editingId} setEditingId={setEditingId} />
        )}
        {activeTab === "skills" && (
          <AdminSkills editingId={editingId} setEditingId={setEditingId} />
        )}
        {activeTab === "categories" && (
          <AdminCategories editingId={editingId} setEditingId={setEditingId} />
        )}
      </div>
    </div>
  );
}

// ==================== TEAMS ADMIN ====================
function AdminTeams({
  editingId,
  setEditingId,
}: {
  editingId: number | null;
  setEditingId: (id: number | null) => void;
}) {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  const { data: teams, isLoading } = useQuery({
    queryKey: ["admin", "teams"],
    queryFn: async () => {
      const response = await api.get("/equipes");
      return response.data as Team[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/equipes", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "teams"] });
      setIsCreating(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/equipes/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "teams"] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/equipes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "teams"] });
    },
  });

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsCreating(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Create Team
      </button>

      {isCreating && (
        <AdminForm
          schema={teamSchema}
          defaultValues={{ nome: "", descricao: "" }}
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setIsCreating(false)}
          isPending={createMutation.isPending}
          fields={[
            { name: "nome", label: "Name", type: "text" },
            { name: "descricao", label: "Description", type: "textarea" },
          ]}
        />
      )}

      <div className="grid gap-3">
        {teams?.map((team) => (
          <AdminItem
            key={team.id}
            item={team}
            isEditing={editingId === team.id}
            onEdit={() => setEditingId(team.id)}
            onDelete={() => {
              if (confirm(`Delete team "${team.nome}"?`)) {
                deleteMutation.mutate(team.id);
              }
            }}
            editForm={
              <AdminForm
                schema={teamSchema}
                defaultValues={{
                  nome: team.nome,
                  descricao: team.descricao || "",
                }}
                onSubmit={(data) =>
                  updateMutation.mutate({ id: team.id, data })
                }
                onCancel={() => setEditingId(null)}
                isPending={updateMutation.isPending}
                fields={[
                  { name: "nome", label: "Name", type: "text" },
                  { name: "descricao", label: "Description", type: "textarea" },
                ]}
              />
            }
          >
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{team.usuarios?.length || 0} members</span>
              <span>{team.projetos?.length || 0} projects</span>
              <span className="font-mono text-xs">
                Code: {team.codigoIngresso}
              </span>
            </div>
          </AdminItem>
        ))}
      </div>
    </div>
  );
}

// ==================== PROJECTS ADMIN ====================
function AdminProjects({
  editingId,
  setEditingId,
}: {
  editingId: number | null;
  setEditingId: (id: number | null) => void;
}) {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: async () => {
      const response = await api.get("/projetos");
      return response.data as Project[];
    },
  });

  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const response = await api.get("/equipes");
      return response.data as Team[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/projetos", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
      setIsCreating(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/projetos/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/projetos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
    },
  });

  if (isLoading) return <AdminSkeleton />;

  const statusOptions = ["planejado", "em_andamento", "concluido", "cancelado"];

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsCreating(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Create Project
      </button>

      {isCreating && (
        <AdminForm
          schema={projectSchema}
          defaultValues={{
            nome: "",
            descricao: "",
            status: "planejado",
            equipeId: teams?.[0]?.id || 0,
          }}
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setIsCreating(false)}
          isPending={createMutation.isPending}
          fields={[
            { name: "nome", label: "Name", type: "text" },
            { name: "descricao", label: "Description", type: "textarea" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: statusOptions.map((s) => ({
                value: s,
                label: s.replace("_", " ").toUpperCase(),
              })),
            },
            {
              name: "equipeId",
              label: "Team",
              type: "select",
              options:
                teams?.map((t) => ({ value: t.id, label: t.nome })) || [],
            },
          ]}
        />
      )}

      <div className="grid gap-3">
        {projects?.map((project) => (
          <AdminItem
            key={project.id}
            item={project}
            isEditing={editingId === project.id}
            onEdit={() => setEditingId(project.id)}
            onDelete={() => {
              if (confirm(`Delete project "${project.nome}"?`)) {
                deleteMutation.mutate(project.id);
              }
            }}
            editForm={
              <AdminForm
                schema={projectSchema}
                defaultValues={{
                  nome: project.nome,
                  descricao: project.descricao || "",
                  status: project.status,
                  equipeId: project.equipeId,
                }}
                onSubmit={(data) =>
                  updateMutation.mutate({ id: project.id, data })
                }
                onCancel={() => setEditingId(null)}
                isPending={updateMutation.isPending}
                fields={[
                  { name: "nome", label: "Name", type: "text" },
                  { name: "descricao", label: "Description", type: "textarea" },
                  {
                    name: "status",
                    label: "Status",
                    type: "select",
                    options: statusOptions.map((s) => ({
                      value: s,
                      label: s.replace("_", " ").toUpperCase(),
                    })),
                  },
                  {
                    name: "equipeId",
                    label: "Team",
                    type: "select",
                    options:
                      teams?.map((t) => ({ value: t.id, label: t.nome })) || [],
                  },
                ]}
              />
            }
          >
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Team: {project.equipe?.nome || "N/A"}</span>
              <span className="capitalize">
                Status: {project.status.replace("_", " ")}
              </span>
              <span>{project.skills?.length || 0} skills</span>
            </div>
          </AdminItem>
        ))}
      </div>
    </div>
  );
}

// ==================== SKILLS ADMIN ====================
function AdminSkills({
  editingId,
  setEditingId,
}: {
  editingId: number | null;
  setEditingId: (id: number | null) => void;
}) {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  const { data: skills, isLoading } = useQuery({
    queryKey: ["admin", "skills"],
    queryFn: async () => {
      const response = await api.get("/skills");
      return response.data as Skill[];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/categorias");
      return response.data as Category[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/skills", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "skills"] });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setIsCreating(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/skills/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "skills"] });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/skills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "skills"] });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsCreating(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Create Skill
      </button>

      {isCreating && (
        <AdminForm
          schema={skillSchema}
          defaultValues={{ nome: "", categoriaId: categories?.[0]?.id || 0 }}
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setIsCreating(false)}
          isPending={createMutation.isPending}
          fields={[
            { name: "nome", label: "Name", type: "text" },
            {
              name: "categoriaId",
              label: "Category",
              type: "select",
              options:
                categories?.map((c) => ({ value: c.id, label: c.nome })) || [],
            },
          ]}
        />
      )}

      <div className="grid gap-3">
        {skills?.map((skill) => (
          <AdminItem
            key={skill.id}
            item={skill}
            isEditing={editingId === skill.id}
            onEdit={() => setEditingId(skill.id)}
            onDelete={() => {
              if (confirm(`Delete skill "${skill.nome}"?`)) {
                deleteMutation.mutate(skill.id);
              }
            }}
            editForm={
              <AdminForm
                schema={skillSchema}
                defaultValues={{
                  nome: skill.nome,
                  categoriaId: skill.categoriaId,
                }}
                onSubmit={(data) =>
                  updateMutation.mutate({ id: skill.id, data })
                }
                onCancel={() => setEditingId(null)}
                isPending={updateMutation.isPending}
                fields={[
                  { name: "nome", label: "Name", type: "text" },
                  {
                    name: "categoriaId",
                    label: "Category",
                    type: "select",
                    options:
                      categories?.map((c) => ({
                        value: c.id,
                        label: c.nome,
                      })) || [],
                  },
                ]}
              />
            }
          >
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Category: {skill.categoria?.nome || "N/A"}</span>
            </div>
          </AdminItem>
        ))}
      </div>
    </div>
  );
}

// ==================== CATEGORIES ADMIN ====================
function AdminCategories({
  editingId,
  setEditingId,
}: {
  editingId: number | null;
  setEditingId: (id: number | null) => void;
}) {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const response = await api.get("/categorias");
      return response.data as Category[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/categorias", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsCreating(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/categorias/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/categorias/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsCreating(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Create Category
      </button>

      {isCreating && (
        <AdminForm
          schema={categorySchema}
          defaultValues={{ nome: "" }}
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setIsCreating(false)}
          isPending={createMutation.isPending}
          fields={[{ name: "nome", label: "Name", type: "text" }]}
        />
      )}

      <div className="grid gap-3">
        {categories?.map((category) => (
          <AdminItem
            key={category.id}
            item={category}
            isEditing={editingId === category.id}
            onEdit={() => setEditingId(category.id)}
            onDelete={() => {
              if (
                confirm(
                  `Delete category "${category.nome}"? This will fail if skills are using it.`,
                )
              ) {
                deleteMutation.mutate(category.id);
              }
            }}
            editForm={
              <AdminForm
                schema={categorySchema}
                defaultValues={{ nome: category.nome }}
                onSubmit={(data) =>
                  updateMutation.mutate({ id: category.id, data })
                }
                onCancel={() => setEditingId(null)}
                isPending={updateMutation.isPending}
                fields={[{ name: "nome", label: "Name", type: "text" }]}
              />
            }
          />
        ))}
      </div>
    </div>
  );
}

// ==================== ADMIN UI COMPONENTS ====================

interface AdminFormField {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "number";
  options?: { value: string | number; label: string }[];
}

function AdminForm({
  schema,
  defaultValues,
  onSubmit,
  onCancel,
  isPending,
  fields,
}: {
  schema: z.ZodObject<any>;
  defaultValues: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
  fields: AdminFormField[];
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 border rounded-lg bg-muted/30 space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.name}
            className={field.type === "textarea" ? "sm:col-span-2" : ""}
          >
            <label className="text-sm font-medium">{field.label}</label>
            {field.type === "select" ? (
              <select
                {...register(field.name)}
                className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                {...register(field.name)}
                className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              />
            ) : (
              <input
                {...register(field.name)}
                type={field.type}
                className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            {errors[field.name] && (
              <p className="text-sm text-red-600 mt-1">
                {errors[field.name]?.message as string}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1 px-4 py-2 border rounded-md hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
      </div>
    </form>
  );
}

function AdminItem({
  item,
  isEditing,
  onEdit,
  onDelete,
  editForm,
  children,
}: {
  item: { id: number; nome: string };
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  editForm: React.ReactNode;
  children?: React.ReactNode;
}) {
  if (isEditing) {
    return editForm;
  }

  return (
    <div className="p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold">{item.nome}</h3>
          {children}
        </div>
        <div className="flex gap-1 ml-4">
          <button
            onClick={onEdit}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-32" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 border rounded-lg space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      ))}
    </div>
  );
}
