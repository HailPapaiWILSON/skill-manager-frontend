import React from "react";
import { Card } from "../../../components/ui/Card";
import styles from "./Overview.module.css";

const Overview = ({ team }) => {
  return (
    <div className={styles.grid}>
      <Card>
        <h4>Membros</h4>
        <p>{team.usuarios?.length || 0}</p>
      </Card>
      <Card>
        <h4>Projetos</h4>
        <p>{team.projetos?.length || 0}</p>
      </Card>
      <Card>
        <h4>Código de Ingresso</h4>
        <p className={styles.code}>{team.codigoIngresso}</p>
      </Card>
    </div>
  );
};

export default Overview;
