'use client'
import styles from "./page.module.css";
import { fetchProposals } from "./utils/fetchProposals";
import React, { 
  useEffect, 
  useState 
} from "react";


const Home:React.FC = () => {

  // grab proposals from github
  const [proposals, setProposals] = useState([])
  const loadData = async () => {
    let proposals = await fetchProposals()
    setProposals(await proposals)
  }


  useEffect(() => {
    loadData()
  }, [])

  console.log(proposals)
  
  return (
    <main className={styles.main}>
      <div>OD Governance App</div>
    </main>
  );
}

export default Home;
