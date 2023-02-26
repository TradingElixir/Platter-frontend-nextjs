import styles from "../styles/Home.module.css";

import GetWalletTokens from "./getWalletTokens";
import Nfts from "./NFTs";
import TransferHistory from "./Transactions";


export default function TableContent({ activeTab,tokens ,setTokens }) {
  return (
    <section className={styles.tableContent}>
      
      <section className={styles.tableAssets_container}>
       { activeTab==="tokens" && <GetWalletTokens tokens={tokens}  setTokens={setTokens}/> }
       
       {activeTab==="transactions" && <TransferHistory/>}
      </section> 
    </section>
  );
}
