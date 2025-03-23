"use client";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";



  function Home() {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Online Examination System</h1>
          <div className={styles.buttons}>
            <Link href="/adminregistration" className={styles.button}>
              Administrator Registration
            </Link>
            <Link href="/studentregistration" className={styles.button}>
              Student Registration
            </Link>
            <Link href="/login" className={styles.button}>
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  export default Home;