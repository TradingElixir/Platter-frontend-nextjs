import styles from "../styles/Home.module.css";
import {useState} from "react"
import TableHeader from "./tableHeader";
import TableContent from "./tableContent";

export default function LoggedIn({ tokens, setTokens }) {
  const [activeTab,setActiveTab] = useState('tokens')
  return (
    <section className={styles.loggedIn_container}>
      <TableHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <TableContent activeTab={activeTab} tokens={tokens} setTokens={setTokens} />
    </section>
  );
}
