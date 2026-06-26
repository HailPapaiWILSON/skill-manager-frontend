// TeamList.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getTeams } from "../../api/teams";
import { Card } from "../../components/ui/Card";
import { Pagination } from "../../components/ui/Pagination";
import styles from "./TeamList.module.css";

const PAGE_SIZE = 6;

const TeamList = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar equipes</div>;

  const teams = data?.data || [];
  const totalPages = Math.ceil(teams.length / PAGE_SIZE);
  const paginated = teams.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <h1 className={styles.title}>Equipes</h1>
      <div className={styles.grid}>
        {paginated.map((team) => (
          <Link to={`/teams/${team.id}`} key={team.id} className={styles.link}>
            <Card className={styles.card}>
              <h3>{team.nome}</h3>
              <p className={styles.desc}>{team.descricao || "Sem descrição"}</p>
              <span className={styles.code}>Código: {team.codigoIngresso}</span>
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

export default TeamList;
