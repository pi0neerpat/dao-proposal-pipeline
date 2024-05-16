'use client'
import styles from "./page.module.css";
import { fetchProposals } from "./lib/fetchProposals";
import React, { 
  useEffect, 
  useState 
} from "react";
import Proposals from "./components/Proposals";
import { ProposalType } from '@/app/types/proposal'


const Home:React.FC = () => {

  // grab proposals from github
  const [proposals, setProposals] = useState<ProposalType[] | []>([])
  const loadData = async () => {
    let proposals = await fetchProposals()
    setProposals(await proposals)
  }


  useEffect(() => {
    loadData()
  }, [])

  
  return (
    <main className={styles.main}>
      <div>OD Governance App</div>
      <Proposals proposals={proposals}/>
    </main>
  );
}

export default Home;
