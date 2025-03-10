"use client";
import { Button } from "antd";
import { useSession } from "next-auth/react";
import styles from "./page.module.css";

export default function Home() {
  const session = useSession();

  console.log("page的输出：", session);
  return (
    <div className={styles.page}>
      <Button>aaaaaa</Button>
    </div>
  );
}
