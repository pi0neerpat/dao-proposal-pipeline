'use client'
import styles from "./page.module.css";
import React from "react";
import Proposals from "./components/Proposals";
import { useProposalContext } from "./contexts/ProposalsContext";


const Home:React.FC = () => {

  const {proposals, setProposals} = useProposalContext()
  
  return (
    <main className={styles.main}>
      <Proposals proposals={proposals}/>
    </main>
  );
}

export default Home;
