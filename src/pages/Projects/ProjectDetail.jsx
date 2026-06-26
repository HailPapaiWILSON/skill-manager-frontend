import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectDetails } from "../../api/projects";
import { Card } from "../../components/ui/Card";
import styles from "./ProjectDetail.module.css";

const ProjectDetail = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["project", id, "details"],
    queryFn: () => getProjectDetails(id),
    enabled: !!id,
  });

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar projeto</div>;

  const project = data?.data;
  if (!project) return <div>Projeto não encontrado</div>;

  return (
    <div>
      <h1 className={styles.title}>{project.nome}</h1>
      <div className={styles.grid}>
        <Card>
          <h4>Descrição</h4>
          <p>{project.descricao || "Sem descrição"}</p>
        </Card>
        <Card>
          <h4>Status</h4>
          <p>{project.status}</p>
        </Card>
        <Card>
          <h4>Equipe</h4>
          <p>{project.equipe?.nome || "N/A"}</p>
        </Card>
      </div>
      <Card className={styles.skills}>
        <h4>Skills Necessárias</h4>
        {project.skills?.length === 0 ? (
          <p>Nenhuma skill cadastrada.</p>
        ) : (
          <ul>
            {project.skills.map((ps) => (
              <li key={ps.skillId}>{ps.skill?.nome || "Skill"}</li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default ProjectDetail;
