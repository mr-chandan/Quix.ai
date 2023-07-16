import { useEffect, useState } from 'react';
import styles from '@/styles/managequiz.module.css';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import copy from 'copy-to-clipboard';
import { useRouter } from 'next/router';


const Managequiz = ({ userid }) => {
  const [responsedata, setresponsedata] = useState([]);
  const [check, setcheck] = useState(false);
  const router = useRouter();
  useEffect(() => {
    console.log("dd", userid)
    if (userid) {
      fetchQuestions(userid);
    }
  }, [userid]);

  const fetchQuestions = async (userId) => {
    try {
      const formsRef = collection(db, 'McqForms');
      const q = query(formsRef, where('createduser', '==', userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const questionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setresponsedata(questionsData);
        console.log(questionsData);
      } else {
        setcheck(true)
        console.log('No such document!');
      }
    } catch (error) {
      console.error(error);
    }
  };
  if (check && responsedata.length === 0) {
    return (
      <div className={styles.lod}>
        <div className={styles.lods}>
          <img src="/foundno.gif" />
          No Data found
        </div>
      </div>
    );
  }

  return (
    <div className={styles.outcont}>
      {responsedata.length > 0 ? (
        responsedata.map((data, index) => (
          <div key={index} className={styles.container}>
            <div>
              Topic: {data.topic.length > 12 ? `${data.topic.substring(0, 14)}...` : data.topic}
            </div>
            <div
              className={styles.gaplog}
              onClick={() => router.push(`/forms/${data.questionid}`)}
            >
              <img src="/share.png" />
              Link to Forms
            </div>
            <div
              className={styles.gaplog}
              onClick={() =>
                copy(`https://quix-delta.vercel.app/forms/${data.questionid}`)
              }
            >
              <img src="/copylink.png" />
              Copy forms link
            </div>
            <div
              className={styles.gaplog}
              onClick={() =>
                router.push(`/admin/managequix/${data.questionid}`)
              }
            >
              <img src="/stats.png" />
              Get Detailed Report
            </div>
          </div>
        ))
      ) : (
        <div className={styles.lod}>
          <div className={styles.lods}>
            <img src="/Book.gif" />
            Loading...
          </div>
        </div>
      )}
    </div>
  );
}
export default Managequiz;
