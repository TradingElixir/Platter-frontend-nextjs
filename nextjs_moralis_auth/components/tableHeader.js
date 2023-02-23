import styles from "../styles/Home.module.css";
import React, { useState } from 'react';
import Tokens from './getWalletTokens';
import NFTs from './NFTs';
import Transactions from './Transactions';

  

export default function TableHeader({activeTab,setActiveTab}) {
  // const [selectedOption, setSelectedOption] = useState('Tokens');
  return (
    <section className={styles.tableHeader}>
      <section className={styles.assets}>
        Assets{" "}
        <section className={styles.menuDots}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
              clipRule="evenodd"
            />
          </svg>
        </section>
      </section>
      <section className={styles.tableHeader_options}>
        <p className={styles.listView}>
          List view{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
              clipRule="evenodd"
            />
          </svg>
        </p>
        <div>
      <section className={styles.displayAssetsOption}>
        <p className={activeTab==="tokens"?styles.tokens:null} onClick={() => setActiveTab('tokens')}>
          Tokens
        </p>
        <p className={activeTab==="nfts"?styles.tokens:null} onClick={() => setActiveTab('nfts')}>NFTs</p>
        <p className={activeTab==="transactions"?styles.tokens:null} onClick={() => setActiveTab('transactions')}>Transactions</p>
      </section>

      
    </div>
      </section>
    </section>
  );
}
