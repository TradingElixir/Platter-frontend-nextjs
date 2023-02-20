import styles from "../styles/Home.module.css";

import GetWalletTokens from "./getWalletTokens";

export default function TableContent({ tokens, setTokens }) {
  return (
    <section className={styles.tableContent}>
      <section className={styles.tableTitle}>
        <section>Token</section>
        <section className={styles.portfolio}>Portfolio %</section>
        <section>Price</section>
        <section>Balance</section>
      </section>
      <section className={styles.tableAssets_container}>
        <GetWalletTokens tokens={tokens} setTokens={setTokens} />
      </section>
    </section>
  );
}
