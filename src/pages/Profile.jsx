import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../hooks/useNotification";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUser,
  updateUserProfile,
  getUserSkills,
  createUserSkill,
  updateUserSkill,
  deleteUserSkill,
} from "../api/profile";
import { getSkills } from "../api/skills";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Table } from "../components/ui/Table";
import { SkillSelector } from "../components/ui/SkillSelector";
import styles from "./Profile.module.css";

const Profile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useNotification();

  // States for editing
  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Skill modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null); // null = create
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [nivel, setNivel] = useState("junior");
  const [anosExperiencia, setAnosExperiencia] = useState(0);

  // Fetch user data
  const userQuery = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => getUser(user.id),
    enabled: !!user?.id,
  });

  // Fetch user's skills
  const userSkillsQuery = useQuery({
    queryKey: ["userSkills", user?.id],
    queryFn: getUserSkills,
    enabled: !!user?.id,
  });

  // Fetch all skills for dropdown
  const skillsQuery = useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: (data) => updateUserProfile(user.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["user", user.id]);
      showToast("Perfil atualizado!", "success");
    },
    onError: (err) => {
      showToast(
        err.response?.data?.error || "Erro ao atualizar perfil",
        "error",
      );
    },
  });

  // Create user skill
  const createSkillMutation = useMutation({
    mutationFn: createUserSkill,
    onSuccess: () => {
      queryClient.invalidateQueries(["userSkills"]);
      showToast("Skill adicionada!", "success");
      closeModal();
    },
    onError: (err) => {
      showToast(
        err.response?.data?.error || "Erro ao adicionar skill",
        "error",
      );
    },
  });

  // Update user skill
  const updateSkillMutation = useMutation({
    mutationFn: ({ usuarioId, skillId, data }) =>
      updateUserSkill(usuarioId, skillId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["userSkills"]);
      showToast("Skill atualizada!", "success");
      closeModal();
    },
    onError: (err) => {
      showToast(
        err.response?.data?.error || "Erro ao atualizar skill",
        "error",
      );
    },
  });

  // Delete user skill
  const deleteSkillMutation = useMutation({
    mutationFn: ({ usuarioId, skillId }) => deleteUserSkill(usuarioId, skillId),
    onSuccess: () => {
      queryClient.invalidateQueries(["userSkills"]);
      showToast("Skill removida!", "success");
    },
    onError: (err) => {
      showToast(err.response?.data?.error || "Erro ao remover skill", "error");
    },
  });

  // Fill form with user data when loaded
  useEffect(() => {
    if (userQuery.data?.data) {
      setNome(userQuery.data.data.nome || "");
      setBio(userQuery.data.data.bio || "");
    }
  }, [userQuery.data]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setEditLoading(true);
    updateProfile.mutate({ nome, bio });
    setEditLoading(false);
  };

  const handleAddSkill = () => {
    setEditingSkill(null);
    setSelectedSkills([]);
    setNivel("junior");
    setAnosExperiencia(0);
    setModalOpen(true);
  };

  const handleEditSkill = (usuarioSkill) => {
    const allSkills = skillsQuery.data?.data || [];
    const skill = allSkills.find((s) => s.id === usuarioSkill.skillId);
    setEditingSkill(usuarioSkill);
    setSelectedSkills(skill ? [skill] : []);
    setNivel(usuarioSkill.nivel);
    setAnosExperiencia(usuarioSkill.anosExperiencia || 0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSkill(null);
    setSelectedSkills([]);
    setNivel("junior");
    setAnosExperiencia(0);
  };

  const handleModalSubmit = () => {
    if (selectedSkills.length === 0) {
      showToast("Selecione pelo menos uma skill", "error");
      return;
    }

    const skill = selectedSkills[0];
    const data = {
      nivel,
      anosExperiencia: Number(anosExperiencia),
      skillId: skill.id,
      usuarioId: user.id,
    };

    if (editingSkill) {
      updateSkillMutation.mutate({
        usuarioId: user.id,
        skillId: skill.id,
        data: { nivel, anosExperiencia: Number(anosExperiencia) },
      });
    } else {
      createSkillMutation.mutate(data);
    }
  };

  const handleDeleteSkill = (skillId) => {
    if (window.confirm("Tem certeza que deseja remover esta skill?")) {
      deleteSkillMutation.mutate({ usuarioId: user.id, skillId });
    }
  };

  // Handle skill selection for the modal
  const handleSelectSkill = (skill) => {
    // For modal, we only allow one skill selection (edit or create)
    setSelectedSkills([skill]);
  };

  const handleRemoveSkill = (skillId) => {
    setSelectedSkills(selectedSkills.filter((s) => s.id !== skillId));
  };

  if (
    userQuery.isLoading ||
    userSkillsQuery.isLoading ||
    skillsQuery.isLoading
  ) {
    return <div>Carregando perfil...</div>;
  }

  const userData = userQuery.data?.data;
  const userSkills = userSkillsQuery.data?.data || [];
  const allSkills = skillsQuery.data?.data || [];

  // Filter user's skills to get full skill names
  const userSkillsWithNames = userSkills
    .filter((us) => us.usuarioId === user.id)
    .map((us) => {
      const skill = allSkills.find((s) => s.id === us.skillId);
      return {
        ...us,
        skillName: skill?.nome || "Desconhecida",
        category: skill?.categoria?.nome,
      };
    });

  return (
    <div>
      <h1>Meu Perfil</h1>
      <div className={styles.grid}>
        <Card className={styles.profileCard}>
          <h3>Dados Pessoais</h3>
          <form onSubmit={handleEditSubmit}>
            <Input
              label="Nome"
              name="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <Input
              label="Bio"
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Sobre você..."
            />
            <Button type="submit" disabled={editLoading}>
              {editLoading ? "Salvando..." : "Salvar"}
            </Button>
          </form>
        </Card>

        <Card className={styles.skillsCard}>
          <div className={styles.skillHeader}>
            <h3>Minhas Skills</h3>
            <Button onClick={handleAddSkill}>Adicionar Skill</Button>
          </div>
          {userSkillsWithNames.length === 0 ? (
            <p>Nenhuma skill cadastrada.</p>
          ) : (
            <Table
              columns={["Skill", "Categoria", "Nível", "Anos Exp.", "Ações"]}
              data={userSkillsWithNames}
              renderRow={(us) => (
                <tr key={us.id || `${us.usuarioId}-${us.skillId}`}>
                  <td>{us.skillName}</td>
                  <td>{us.category || "-"}</td>
                  <td>
                    <span
                      className={`${styles.levelBadge} ${styles[`level${us.nivel}`]}`}
                    >
                      {us.nivel}
                    </span>
                  </td>
                  <td>{us.anosExperiencia}</td>
                  <td>
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => handleEditSkill(us)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDeleteSkill(us.skillId)}
                    >
                      Remover
                    </Button>
                  </td>
                </tr>
              )}
            />
          )}
        </Card>
      </div>

      {/* Modal for adding/editing skill */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>{editingSkill ? "Editar Skill" : "Adicionar Skill"}</h3>
              <button className={styles.modalClose} onClick={closeModal}>
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <SkillSelector
                skills={allSkills}
                selectedSkills={selectedSkills}
                onSelect={handleSelectSkill}
                onRemove={handleRemoveSkill}
                label="Skill"
                required
              />

              <div className={styles.formGroup}>
                <label>Nível</label>
                <select
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                >
                  <option value="junior">Júnior</option>
                  <option value="pleno">Pleno</option>
                  <option value="senior">Sênior</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Anos de Experiência</label>
                <input
                  type="number"
                  value={anosExperiencia}
                  onChange={(e) => setAnosExperiencia(e.target.value)}
                  min="0"
                  step="1"
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Button variant="secondary" onClick={closeModal}>
                Cancelar
              </Button>
              <Button
                onClick={handleModalSubmit}
                disabled={
                  createSkillMutation.isLoading ||
                  updateSkillMutation.isLoading ||
                  selectedSkills.length === 0
                }
              >
                {editingSkill ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
