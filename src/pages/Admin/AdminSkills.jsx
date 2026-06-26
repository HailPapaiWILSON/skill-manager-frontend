import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../../api/skills";
import { getCategories } from "../../api/categories";
import { Table } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { useNotification } from "../../hooks/useNotification";
import styles from "./AdminSkills.module.css";

const AdminSkills = () => {
  const queryClient = useQueryClient();
  const { showToast } = useNotification();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [nome, setNome] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "skills"],
    queryFn: getSkills,
  });
  const { data: categoriesData } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "skills"]);
      showToast("Skill criada!", "success");
      closeModal();
    },
    onError: (err) => showToast(err.response?.data?.error || "Erro", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "skills"]);
      showToast("Skill atualizada!", "success");
      closeModal();
    },
    onError: (err) => showToast(err.response?.data?.error || "Erro", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "skills"]);
      showToast("Skill removida!", "success");
    },
    onError: (err) => showToast(err.response?.data?.error || "Erro", "error"),
  });

  const openCreate = () => {
    setEditingSkill(null);
    setNome("");
    setCategoriaId("");
    setModalOpen(true);
  };

  const openEdit = (skill) => {
    setEditingSkill(skill);
    setNome(skill.nome);
    setCategoriaId(skill.categoriaId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSkill(null);
    setNome("");
    setCategoriaId("");
  };

  const handleSubmit = () => {
    const data = { nome, categoriaId: Number(categoriaId) };
    if (editingSkill) {
      updateMutation.mutate({ id: editingSkill.id, data });
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
  if (error) return <div>Erro ao carregar skills</div>;

  const skills = data?.data || [];
  const categories = categoriesData?.data || [];

  return (
    <div>
      <div className={styles.header}>
        <h2>Gerenciar Skills</h2>
        <Button onClick={openCreate}>Nova Skill</Button>
      </div>
      <Table
        columns={["ID", "Nome", "Categoria", "Ações"]}
        data={skills}
        renderRow={(skill) => (
          <tr key={skill.id}>
            <td>{skill.id}</td>
            <td>{skill.nome}</td>
            <td>{skill.categoria?.nome || "N/A"}</td>
            <td>
              <Button
                variant="outline"
                size="small"
                onClick={() => openEdit(skill)}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={() => handleDelete(skill.id)}
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
        title={editingSkill ? "Editar Skill" : "Nova Skill"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {editingSkill ? "Atualizar" : "Criar"}
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
        <div className={styles.formGroup}>
          <label>Categoria</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>
      </Modal>
    </div>
  );
};

export default AdminSkills;
