'use client'
import Image from "next/image";
import styles from "./page.module.css";
import { fetchProposals } from "./utils/fetchProposals";
import { useEffect } from "react";


export default function Home() {
  useEffect(() => {
    const loadData = async () => {
      console.log(await fetchProposals())
    }
    loadData()
  }, [])
  console.log(fetchProposals())
  return (
    <main className={styles.main}>
      <div>OD Governance App</div>
    </main>
  );
}
