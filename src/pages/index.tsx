import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import styled from "styled-components";

import styles from "./index.module.css";

const StyledSpan = styled.span`
  font-size: 2rem;
  color: #dddddd;
  background-color: #661111;
  line-height: 2.2rem;
`;

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Create <span className={styles.pinkSpan}>T3</span> App
        </h1>
        <div className={styles.cardRow}>
          <Link
            className={styles.card}
            href="https://create.t3.gg/en/usage/first-steps"
            target="_blank"
          >
            <h3 className={styles.cardTitle}>First Steps →</h3>
            <div className={styles.cardText}>
              Just the basics - Everything you need to know to set up your
              database and authentication.
            </div>
          </Link>
          <Link
            className={styles.card}
            href="https://create.t3.gg/en/introduction"
            target="_blank"
          >
            <h3 className={styles.cardTitle}>Documentation →</h3>
            <div className={styles.cardText}>
              <StyledSpan>
                Here is my first element using styled-components!
              </StyledSpan>
            </div>
          </Link>
        </div>
        <div className={styles.showcaseContainer}>
          <p className={styles.showcaseText}>Hello!</p>
          <AuthShowcase />
        </div>
      </div>
    </main>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();
  console.log({ sessionData });

  return (
    <div className={styles.authContainer}>
      <p className={styles.showcaseText}>
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <button
        className={styles.loginButton}
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
