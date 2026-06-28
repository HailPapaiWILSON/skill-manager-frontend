// src/pages/Teams/TeamDetail/index.jsx
import React, { Suspense, lazy, startTransition } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTeamDetails } from "../../../api/teams";
import { Tabs } from "../../../components/ui/Tabs";
import Overview from "./Overview";
import Members from "./Members";
import Projects from "./Projects";
const Analytics = lazy(() => import("./Analytics"));
import styles from "./index.module.css";

const tabs = [
  { id: "overview", label: "Visão Geral" },
  { id: "members", label: "Membros" },
  { id: "projects", label: "Projetos" },
  { id: "analytics", label: "Análises" },
];

const TeamDetail = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const { data, isLoading, error } = useQuery({
    queryKey: ["team", id, "details"],
    queryFn: () => getTeamDetails(id),
    enabled: !!id,
  });

  const handleTabChange = (tabId) => {
    // ✅ Wrap in startTransition to fix the suspense error
    startTransition(() => {
      setSearchParams({ tab: tabId });
    });
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar detalhes da equipe</div>;

  const team = data?.data;
  if (!team) return <div>Equipe não encontrada</div>;

  return (
    <div>
      <h1 className={styles.title}>{team.nome}</h1>
      <p className={styles.desc}>{team.descricao}</p>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
      <div className={styles.content}>
        {activeTab === "overview" && <Overview team={team} />}
        {activeTab === "members" && <Members teamId={team.id} />}
        {activeTab === "projects" && <Projects teamId={team.id} />}
        {activeTab === "analytics" && (
          <Suspense fallback={<div>Carregando análises...</div>}>
            <Analytics teamId={team.id} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default TeamDetail;
