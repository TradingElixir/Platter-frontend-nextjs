import axios from "axios";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Card from "./card.js";
import styles from "../styles/Home.module.css";

export default function GetWalletTokens({tokens, setTokens}) {
  const { address } = useAccount();
  
  useEffect(() => {
    let response;
    async function getData() {
      response = await axios
        .get(`http://localhost:5001/gettokens`, {
          params: { address },
        })
        .then((response) => {
          console.log(response.data);
          setTokens(response.data);
        });
    }
    
      getData();
    
  }, []);

  return (
    <section style={{"overflow-y":'auto',"overflow-x":'hidden',"padding-right":'2rem'}}>
       
      <section className={styles.tableTitle}>
        <section>Token</section>
       
        <section>Price</section>
        <section className={styles.portfolio}>Balance</section>
      </section>
     <section style={{'height':'60vh', "overflow-y":'auto',"overflow-x":'hidden'}}>
      {tokens.length>0 &&
        tokens.map((token) => {
          return (
            token.usdPrice>0 && (
              <Card
                token={token}
                total={tokens[3]}
                key={token.walletBalance?.symbol}
              />
            )
          );
        })}
        </section>
    </section>
  );
}
