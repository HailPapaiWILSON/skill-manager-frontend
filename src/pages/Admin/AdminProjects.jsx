import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../api/projects";
import { getTeams } from "../../api/teams";
import { getSkills } from "../../api/skills";
import {
  createProjectSkill,
  deleteProjectSkill,
} from "../../api/skills-projetos";
import { Table } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { useNotification } from "../../hooks/useNotification";
import styles from "./AdminProjects.module.css";

const AdminProjects = () => {
  const queryClient = useQueryClient();
  const { showToast } = useNotification();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("planejado");
  const [equipeId, setEquipeId] = useState("");

  const {
    data: projectsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: getProjects,
  });
  const { data: teamsData } = useQuery({
    queryKey: ["admin", "teams"],
    queryFn: getTeams,
  });
  const { data: skillsData } = useQuery({
    queryKey: ["admin", "skills"],
    queryFn: getSkills,
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "projects"]);
      showToast("Projeto criado!", "success");
      closeModal();
    },
    onError: (err) => showToast(err.response?.data?.error || "Erro", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "projects"]);
      showToast("Projeto atualizado!", "success");
      closeModal();
    },
    onError: (err) => showToast(err.response?.data?.error || "Erro", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "projects"]);
      showToast("Projeto removido!", "success");
    },
    onError: (err) => showToast(err.response?.data?.error || "Erro", "error"),
  });

  // For project skills we need separate mutations, but for simplicity in admin we may not manage skills directly.
  // We'll skip project skill management in this admin panel to keep it simple, but we can add later.

  const openCreate = () => {
    setEditingProject(null);
    setNome("");
    setDescricao("");
    setStatus("planejado");
    setEquipeId("");
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditingProject(project);
    setNome(project.nome);
    setDescricao(project.descricao || "");
    setStatus(project.status);
    setEquipeId(project.equipeId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProject(null);
    setNome("");
    setDescricao("");
    setStatus("planejado");
    setEquipeId("");
  };

  const handleSubmit = () => {
    const data = { nome, descricao, status, equipeId: Number(equipeId) };
    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar projetos</div>;

  const projects = projectsData?.data || [];
  const teams = teamsData?.data || [];

  return (
    <div>
      <div className={styles.header}>
        <h2>Gerenciar Projetos</h2>
        <Button onClick={openCreate}>Novo Projeto</Button>
      </div>
      <Table
        columns={["ID", "Nome", "Status", "Equipe", "Ações"]}
        data={projects}
        renderRow={(project) => (
          <tr key={project.id}>
            <td>{project.id}</td>
            <td>{project.nome}</td>
            <td>{project.status}</td>
            <td>{project.equipe?.nome || "N/A"}</td>
            <td>
              <Button
                variant="outline"
                size="small"
                onClick={() => openEdit(project)}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={() => handleDelete(project.id)}
              >
                Excluir
              </Button>
            </td>
          </tr>
        )}
      />

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingProject ? "Editar Projeto" : "Novo Projeto"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {editingProject ? "Atualizar" : "Criar"}
            </Button>
          </>
        }
      >
        <Input
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <Input
          label="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <div className={styles.formGroup}>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="planejado">Planejado</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Equipe</label>
          <select
            value={equipeId}
            onChange={(e) => setEquipeId(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.nome}
              </option>
            ))}
          </select>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProjects;
