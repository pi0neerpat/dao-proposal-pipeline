'use client'
import styles from "./page.module.css";
import { fetchProposals } from "./lib/fetchProposals";
import React, { 
  useEffect, 
  useState 
} from "react";
import Proposals from "./components/Proposals";
import { ProposalType } from '@/app/types/proposal'
import { useProposalContext } from "./contexts/ProposalsContext";


const Home:React.FC = () => {

  const {proposals, setProposals} = useProposalContext()
  
  return (
    <main className={styles.main}>
      <div>OD Governance App</div>
      <Proposals proposals={proposals}/>
    </main>
  );
}

export default Home;
