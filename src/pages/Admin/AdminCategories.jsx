import React, { useState } from "react";
import { createPortal } from "react-dom"; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categories";
import { Table } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { useNotification } from "../../hooks/useNotification";
import styles from "./AdminCategories.module.css";

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const { showToast } = useNotification();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [nome, setNome] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "categories"]);
      showToast("Categoria criada!", "success");
      closeModal();
    },
    onError: (err) => showToast(err.response?.data?.error || "Erro", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "categories"]);
      showToast("Categoria atualizada!", "success");
      closeModal();
    },
    onError: (err) => showToast(err.response?.data?.error || "Erro", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "categories"]);
      showToast("Categoria removida!", "success");
    },
    onError: (err) => showToast(err.response?.data?.error || "Erro", "error"),
  });

  const openCreate = () => {
    setEditingCategory(null);
    setNome("");
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setNome(cat.nome);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setNome("");
  };

  const handleSubmit = () => {
    const data = { nome };
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data });
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
  if (error) return <div>Erro ao carregar categorias</div>;

  const categories = data?.data || [];

  return (
    <div>
      <div className={styles.header}>
        <h2>Gerenciar Categorias</h2>
        <Button onClick={openCreate}>Nova Categoria</Button>
      </div>
      
      <Table
        columns={["ID", "Nome", "Ações"]}
        data={categories}
        renderRow={(cat) => (
          <tr key={cat.id}>
            <td>{cat.id}</td>
            <td>{cat.nome}</td>
            <td>
              <Button
                variant="outline"
                size="small"
                onClick={() => openEdit(cat)}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={() => handleDelete(cat.id)}
              >
                Excluir
              </Button>
            </td>
          </tr>
        )}
      />

      {/* MODAL AJUSTADO: Sem estilos inline, controlado 100% pelo arquivo CSS */}
      {modalOpen && typeof window !== "undefined" && createPortal(
        <div className={styles.portalWrapper}>
          <Modal
            isOpen={modalOpen}
            onClose={closeModal}
            title={editingCategory ? "Editar Categoria" : "Nova Categoria"}
            footer={
              <>
                <Button variant="secondary" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                >
                  {editingCategory ? "Atualizar" : "Criar"}
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
          </Modal>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminCategories;
