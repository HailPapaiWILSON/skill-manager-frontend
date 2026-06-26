import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTeams, createTeam, updateTeam, deleteTeam } from "../../api/teams";
import { Table } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { useNotification } from "../../hooks/useNotification";
import styles from "./AdminTeams.module.css";

const AdminTeams = () => {
  const queryClient = useQueryClient();
  const { showToast } = useNotification();

  // State for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [codigoIngresso, setCodigoIngresso] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "teams"],
    queryFn: getTeams,
  });

  const createMutation = useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "teams"]);
      showToast("Equipe criada!", "success");
      closeModal();
    },
    onError: (err) => showToast(err.response?.data?.error || "Erro", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateTeam(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "teams"]);
      showToast("Equipe atualizada!", "success");
      closeModal();
    },
    onError: (err) => showToast(err.response?.data?.error || "Erro", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "teams"]);
      showToast("Equipe removida!", "success");
    },
    onError: (err) => showToast(err.response?.data?.error || "Erro", "error"),
  });

  const openCreate = () => {
    setEditingTeam(null);
    setNome("");
    setDescricao("");
    setCodigoIngresso("");
    setModalOpen(true);
  };

  const openEdit = (team) => {
    setEditingTeam(team);
    setNome(team.nome);
    setDescricao(team.descricao || "");
    setCodigoIngresso(team.codigoIngresso || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTeam(null);
    setNome("");
    setDescricao("");
    setCodigoIngresso("");
  };

  const handleSubmit = () => {
    const data = { nome, descricao };
    if (editingTeam) {
      updateMutation.mutate({ id: editingTeam.id, data });
    } else {
      if (codigoIngresso) data.codigoIngresso = codigoIngresso;
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar equipes</div>;

  const teams = data?.data || [];

  return (
    <div>
      <div className={styles.header}>
        <h2>Gerenciar Equipes</h2>
        <Button onClick={openCreate}>Nova Equipe</Button>
      </div>
      <Table
        columns={["ID", "Nome", "Descrição", "Código", "Ações"]}
        data={teams}
        renderRow={(team) => (
          <tr key={team.id}>
            <td>{team.id}</td>
            <td>{team.nome}</td>
            <td>{team.descricao || "-"}</td>
            <td>{team.codigoIngresso}</td>
            <td>
              <Button
                variant="outline"
                size="small"
                onClick={() => openEdit(team)}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={() => handleDelete(team.id)}
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
        title={editingTeam ? "Editar Equipe" : "Nova Equipe"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {editingTeam ? "Atualizar" : "Criar"}
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
        {!editingTeam && (
          <Input
            label="Código de Ingresso (opcional)"
            value={codigoIngresso}
            onChange={(e) => setCodigoIngresso(e.target.value)}
            placeholder="Deixe em branco para gerar automaticamente"
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminTeams;
