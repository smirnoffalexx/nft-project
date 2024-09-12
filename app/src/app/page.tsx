// import Image from "next/image";
import styles from "./page.module.css";
import EventsDisplay from "./components/events";
import MetaMaskConnector from "./components/connector";
// import Connect from "./components/connect";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <MetaMaskConnector />
        <EventsDisplay />
      </main>
    </div>
  );
}
