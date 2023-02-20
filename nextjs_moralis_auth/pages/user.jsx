import { useState } from "react";
import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import LoggedIn from "../components/loggedIn";
import styles from "../styles/Home.module.css";

function User({ user }) {
  const [walletValue, setWalletValue] = useState("");
  const [tokens, setTokens] = useState([]);

  const connectWallet = async () => {
    const response = await axios.get(`http://localhost:5001/gettokens`, {
      params: { address: walletValue },
    });
    setTokens(response.data);
  };
  return (
    <section className={styles.main}>
      <section className={styles.header}>
        <section className={styles.header_section}>
          <h1>MetaMask Portfolio</h1>
          <input
            value={walletValue}
            onChange={({ target }) => setWalletValue(target?.value)}
          />
          <button onClick={connectWallet}>Connect</button>
          <button
            className={styles.connect_btn}
            onClick={() => signOut({ redirect: "/" })}
          >
            Sign out
          </button>
        </section>
        <LoggedIn tokens={tokens} setTokens={setTokens} />
      </section>
    </section>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
}

export default User;
