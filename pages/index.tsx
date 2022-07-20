import type { NextPage } from "next";
import styles from "../styles/index.module.css";
import useAccount from "../lib/useAccount";
import Appwrite from "../lib/appwrite";
import { Account, Databases, Models } from "appwrite";
import { useEffect, useState } from "react";

interface Data extends Models.Document {
  owed: number;
  user: string;
}

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE as string;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION as string;
const url = process.env.NEXT_PUBLIC_DEPLOYMENT_URL as string;

const Home: NextPage = () => {
  const [user, userLoading, userError] = useAccount(Appwrite);
  const [data, setData] = useState<Data | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  async function loadData() {
    const account = new Account(Appwrite);
    let currentUser;
    try {
      currentUser = await account.get();
    } catch (e) {
      setData(null);
      setLoading(false);
      return;
    }
    if (!currentUser) {
      setData(null);
      setLoading(false);
      return;
    }
    const db = new Databases(Appwrite, databaseId);
    const debtDocument = await db.getDocument<Data>(
      collectionId,
      currentUser.$id
    );
    setData(debtDocument);
    setLoading(false);
  }

  function loginUsingDiscord() {
    const account = new Account(Appwrite);
    account.createOAuth2Session("discord", url, url);
  }

  async function logout() {
    const account = new Account(Appwrite);
    await account.deleteSessions();
    location.reload();
  }

  if (userLoading && !userError) {
    return (
      <div className={styles.pageEmpty}>
        <h1 className="text-white">Loading...</h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.pageEmpty}>
        <h1 className="text-white">You are not logged in</h1>
        <button onClick={loginUsingDiscord} className="text-white text-xl underline hover:text-gray-300">Login using Discord</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.pageEmpty}>
        <h1 className="text-white">Loading...</h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.pageEmpty}>
        <h1 className="text-white">Could not find your user data.</h1>
      </div>
    );
  }

  if (data.owed === 0) {
    return (
      <div className={styles.pageEmpty}>
        <h1 className="text-white text-3xl">You have no debt.</h1>
        <p className="text-white">Consider sending a tip.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <button className="text-white float-right mr-10 mb-5" onClick={logout}>
        Logout
      </button>
      <br />
      <div className="absolute inset-y-1/2 -translate-y-1/2 w-screen h-max">
        <h1 className="text-9xl text-center text-red-800 blaka mb-5">
          Du hast Schulden
        </h1>
        <p className="text-white text-center text-sm">
          Deine Schulden betragen:
        </p>
        <p className="text-white text-3xl font-medium text-center">
          {data.owed}€
        </p>
      </div>
    </div>
  );
};

export default Home;
