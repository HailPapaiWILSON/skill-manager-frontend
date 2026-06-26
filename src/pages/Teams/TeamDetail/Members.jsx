import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTeamDetails } from "../../../api/teams";
import { Table } from "../../../components/ui/Table";

const Members = ({ teamId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["team", teamId, "details"],
    queryFn: () => getTeamDetails(teamId),
    enabled: !!teamId,
  });

  if (isLoading) return <div>Carregando membros...</div>;
  if (error) return <div>Erro ao carregar membros</div>;

  const members = data?.data?.usuarios || [];

  if (members.length === 0) return <div>Nenhum membro nesta equipe.</div>;

  const columns = ["Nome", "E-mail", "Função"];
  return (
    <Table
      columns={columns}
      data={members}
      renderRow={(user) => (
        <tr key={user.id}>
          <td>{user.nome}</td>
          <td>{user.email}</td>
          <td>{user.funcao}</td>
        </tr>
      )}
    />
  );
};

export default Members;
