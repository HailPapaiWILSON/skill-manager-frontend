import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getProjects } from "../../api/projects";
import { Card } from "../../components/ui/Card";
import { Pagination } from "../../components/ui/Pagination";
import styles from "./ProjectList.module.css";

const PAGE_SIZE = 6;

const ProjectList = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar projetos</div>;

  const projects = data?.data || [];
  const totalPages = Math.ceil(projects.length / PAGE_SIZE);
  const paginated = projects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <h1 className={styles.title}>Projetos</h1>
      <div className={styles.grid}>
        {paginated.map((proj) => (
          <Link
            to={`/projects/${proj.id}`}
            key={proj.id}
            className={styles.link}
          >
            <Card className={styles.card}>
              <h3>{proj.nome}</h3>
              <p className={styles.desc}>{proj.descricao || "Sem descrição"}</p>
              <span className={styles.status}>Status: {proj.status}</span>
              <span className={styles.team}>
                Equipe: {proj.equipe?.nome || "N/A"}
              </span>
            </Card>
          </Link>
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default ProjectList;
