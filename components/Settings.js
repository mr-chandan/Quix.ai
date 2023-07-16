import { useState, useEffect } from 'react'
import styles from "@/styles/settings.module.css"
// import { useRouter } from 'next/router';
import { app } from "../lib/firebase"
import { getAuth, signOut } from "firebase/auth";

const Settings = () => {
  // const router = useRouter();
  const auth = getAuth(app);

  // useEffect(() => {
  //   const storedTopic = localStorage.getItem('apichatgpt');
  //   if (storedTopic) {
  //     setTopic(storedTopic);
  //   }
  // }, []);

  // const [topic, setTopic] = useState('');
  // const fetchOrders = () => {
  //   localStorage.setItem('apichatgpt', topic);
  //   router.push("/")
  // };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  return (
    <div>
      {/* <div className={styles.inp}>
        How many questions ?
        <input placeholder='Api key' value={topic} onChange={(e) => setTopic(e.target.value)} />
      </div> */}
      {/* <div className={styles.btn} onClick={fetchOrders}>Submit</div> */}
      <button className={styles.btn} onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Settings