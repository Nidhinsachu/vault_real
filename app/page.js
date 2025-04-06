"use client";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("role");

      if (!userId) {
        router.push("/login");
        return;
      }

      if (role === "teacher") {
        router.push("/dashboard/teacher");
      } else if (role === "student") {
        router.push("/dashboard/student");
      } else {
        router.push("/dashboard/admin")
      }
    };

    checkUser();
  }, [router]); // Added router in dependency array

  return <div className={styles.container}></div>;
}

export default Home;
