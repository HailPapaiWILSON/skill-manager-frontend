// pages/Profile.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { useSkills, useCategories } from "../hooks/useSkills";
import { UserSkill } from "../types";
import { Skeleton } from "../components/ui/skeleton";
import { AlertCircle, Plus, Trash2 } from "lucide-react";

const profileSchema = z.object({
  nome: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function Profile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
  const [newSkillLevel, setNewSkillLevel] = useState<
    "junior" | "pleno" | "senior"
  >("pleno");
  const [newSkillYears, setNewSkillYears] = useState(0);

  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Fetch user with skills
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: async () => {
      const response = await api.get(`/usuarios/${user?.id}`);
      return response.data;
    },
    enabled: !!user?.id,
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await api.put(`/usuarios/${user?.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
    },
  });

  // Add skill mutation
  const addSkill = useMutation({
    mutationFn: async () => {
      if (!selectedSkill) throw new Error("Select a skill");
      const response = await api.post("/skills-usuarios", {
        usuarioId: user?.id,
        skillId: selectedSkill,
        nivel: newSkillLevel,
        anosExperiencia: newSkillYears,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
      setSelectedSkill(null);
      setNewSkillLevel("pleno");
      setNewSkillYears(0);
    },
  });

  // Remove skill mutation
  const removeSkill = useMutation({
    mutationFn: async (skillId: number) => {
      await api.delete(`/skills-usuarios/${user?.id}/${skillId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nome: userData?.nome || "",
      bio: userData?.bio || "",
    },
  });

  if (userLoading || skillsLoading || categoriesLoading) {
    return <ProfileSkeleton />;
  }

  const userSkills = userData?.skills || [];

  // Group skills by category
  const skillsByCategory = skills?.reduce(
    (acc, skill) => {
      const categoryName = skill.categoria?.nome || "Uncategorized";
      if (!acc[categoryName]) acc[categoryName] = [];
      acc[categoryName].push(skill);
      return acc;
    },
    {} as Record<string, typeof skills>,
  );

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and skills
        </p>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit((data) => updateProfile.mutate(data))}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <input
            {...register("nome")}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Your name"
          />
          {errors.nome && (
            <p className="text-sm text-red-600">{errors.nome.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Bio</label>
          <textarea
            {...register("bio")}
            className="w-full px-3 py-2 border rounded-md min-h-[100px]"
            placeholder="Tell us about yourself..."
          />
        </div>

        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {updateProfile.isPending ? "Saving..." : "Save Profile"}
        </button>
      </form>

      {/* Skills Section */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">My Skills</h2>

        {/* Current Skills */}
        <div className="space-y-2 mb-6">
          {userSkills.length === 0 ? (
            <p className="text-muted-foreground">No skills added yet</p>
          ) : (
            userSkills.map((skill: UserSkill) => (
              <div
                key={skill.skillId}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <span className="font-medium">{skill.skill?.nome}</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {skill.nivel} • {skill.anosExperiencia} years
                  </span>
                </div>
                <button
                  onClick={() => removeSkill.mutate(skill.skillId)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Skill */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <select
              value={selectedSkill || ""}
              onChange={(e) => setSelectedSkill(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select a skill...</option>
              {skillsByCategory &&
                Object.entries(skillsByCategory).map(
                  ([category, categorySkills]) => (
                    <optgroup key={category} label={category}>
                      {categorySkills.map((skill) => (
                        <option key={skill.id} value={skill.id}>
                          {skill.nome}
                        </option>
                      ))}
                    </optgroup>
                  ),
                )}
            </select>
          </div>

          <select
            value={newSkillLevel}
            onChange={(e) => setNewSkillLevel(e.target.value as any)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="junior">Junior</option>
            <option value="pleno">Pleno</option>
            <option value="senior">Senior</option>
          </select>

          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              max="50"
              value={newSkillYears}
              onChange={(e) => setNewSkillYears(Number(e.target.value))}
              className="flex-1 px-3 py-2 border rounded-md"
              placeholder="Years"
            />
            <button
              onClick={() => addSkill.mutate()}
              disabled={!selectedSkill || addSkill.isPending}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        {addSkill.error && (
          <p className="text-sm text-red-600 mt-2">
            {(addSkill.error as any)?.response?.data?.error ||
              "Failed to add skill"}
          </p>
        )}
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-3xl space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
