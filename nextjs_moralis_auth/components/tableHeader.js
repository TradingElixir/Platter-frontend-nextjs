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
        
        <div>
      <section className={styles.displayAssetsOption}>
        <p className={activeTab==="tokens"?styles.tokens:null} onClick={() => setActiveTab('tokens')}>
          Tokens
        </p>
        
        <p className={activeTab==="transactions"?styles.tokens:null} onClick={() => setActiveTab('transactions')}>Transactions</p>
      </section>

      
    </div>
      </section>
    </section>
  );
}
