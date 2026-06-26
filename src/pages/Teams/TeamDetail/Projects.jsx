import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getTeamDetails } from "../../../api/teams";
import { Table } from "../../../components/ui/Table";

const Projects = ({ teamId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["team", teamId, "details"],
    queryFn: () => getTeamDetails(teamId),
    enabled: !!teamId,
  });

  if (isLoading) return <div>Carregando projetos...</div>;
  if (error) return <div>Erro ao carregar projetos</div>;

  const projects = data?.data?.projetos || [];

  if (projects.length === 0) return <div>Nenhum projeto nesta equipe.</div>;

  const columns = ["Nome", "Status", "Ações"];
  return (
    <Table
      columns={columns}
      data={projects}
      renderRow={(proj) => (
        <tr key={proj.id}>
          <td>{proj.nome}</td>
          <td>{proj.status}</td>
          <td>
            <Link to={`/projects/${proj.id}`}>Ver detalhes</Link>
          </td>
        </tr>
      )}
    />
  );
};

export default Projects;
