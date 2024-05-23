'use client'
import styles from './page.module.css'
import React from 'react'
import Proposals from './components/Proposals'

const Home: React.FC = () => {
  return (
    <main className={styles.main}>
      <Proposals/>
    </main>
  )
}

export default Home
